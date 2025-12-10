import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const opportunity = await db.opportunity.findUnique({
            where: { id },
            include: {
                opportunitySkills: {
                    include: {
                        skill: true,
                    },
                },
                requirements: {
                    orderBy: {
                        displayOrder: "asc",
                    },
                },
            },
        })

        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            opportunity: {
                id: opportunity.id,
                title: opportunity.title,
                company: opportunity.company,
                companyLogo: opportunity.companyLogo,
                type: opportunity.type.toLowerCase(),
                location: opportunity.location,
                remote: opportunity.remote,
                description: opportunity.description,
                salaryMin: opportunity.salaryMin ? Number(opportunity.salaryMin) : null,
                salaryMax: opportunity.salaryMax ? Number(opportunity.salaryMax) : null,
                postedDate: opportunity.postedDate.toISOString(),
                deadline: opportunity.deadline?.toISOString(),
                applicationUrl: opportunity.applicationUrl,
                requirements: opportunity.requirements.map((r: any) => r.requirement),
                skills: opportunity.opportunitySkills.map((os: any) => ({
                    id: os.skill.id,
                    name: os.skill.name,
                })),
            },
        })
    } catch (error: any) {
        console.error("Opportunity fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

