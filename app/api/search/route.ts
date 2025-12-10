import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request).catch(() => null)
        const userId = session ? getUserId(session) : null

        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q") || ""
        const type = searchParams.get("type") || "all" // "all", "users", "skills", "opportunities"

        if (!query || query.length < 2) {
            return NextResponse.json({
                users: [],
                skills: [],
                opportunities: [],
            })
        }

        const results: any = {
            users: [],
            skills: [],
            opportunities: [],
        }

        // Search users
        if (type === "all" || type === "users") {
            const users = await db.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                        {
                            learnerProfile: {
                                OR: [
                                    { currentJobTitle: { contains: query, mode: "insensitive" } },
                                    { currentCompany: { contains: query, mode: "insensitive" } },
                                    { university: { contains: query, mode: "insensitive" } },
                                    { major: { contains: query, mode: "insensitive" } },
                                ],
                            },
                        },
                    ],
                },
                include: {
                    learnerProfile: true,
                    userSkills: {
                        include: {
                            skill: true,
                        },
                        take: 3,
                    },
                },
                take: 10,
            })

            results.users = users.map((user: any) => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                role: user.learnerProfile?.currentJobTitle || "Student",
                company: user.learnerProfile?.currentCompany,
                university: user.learnerProfile?.university,
                skills: user.userSkills.map((us: any) => ({
                    id: us.skill.id,
                    name: us.skill.name,
                })),
            }))
        }

        // Search skills
        if (type === "all" || type === "skills") {
            const skills = await db.skill.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                include: {
                    trendingData: true,
                },
                take: 10,
            })

            results.skills = skills.map((skill: any) => ({
                id: skill.id,
                name: skill.name,
                category: skill.category.toLowerCase().replace("_", "-"),
                description: skill.description,
                verified: skill.verified,
                trending: skill.trendingData
                    ? {
                        demandPercentage: Number(skill.trendingData.demandPercentage),
                        growthRate: Number(skill.trendingData.growthRate),
                        averageSalary: Number(skill.trendingData.averageSalary),
                        openPositions: skill.trendingData.openPositions,
                    }
                    : undefined,
            }))
        }

        // Search opportunities
        if (type === "all" || type === "opportunities") {
            const opportunities = await db.opportunity.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { company: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                        { location: { contains: query, mode: "insensitive" } },
                    ],
                },
                include: {
                    opportunitySkills: {
                        include: {
                            skill: true,
                        },
                    },
                },
                take: 10,
            })

            results.opportunities = opportunities.map((opp: any) => ({
                id: opp.id,
                title: opp.title,
                company: opp.company,
                companyLogo: opp.companyLogo,
                type: opp.type.toLowerCase(),
                location: opp.location,
                remote: opp.remote,
                salaryMin: opp.salaryMin ? Number(opp.salaryMin) : null,
                salaryMax: opp.salaryMax ? Number(opp.salaryMax) : null,
                postedDate: opp.postedDate.toISOString(),
                deadline: opp.deadline?.toISOString(),
                skills: opp.opportunitySkills.map((os: any) => ({
                    id: os.skill.id,
                    name: os.skill.name,
                })),
            }))
        }

        return NextResponse.json(results)
    } catch (error: any) {
        console.error("Search error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

