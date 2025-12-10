import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""

        // Get user's existing connections
        const existingConnections = await db.connection.findMany({
            where: {
                userId,
            },
            select: {
                connectedUserId: true,
            },
        })
        const connectedUserIds = new Set(existingConnections.map((c: any) => c.connectedUserId))

        // Get pending requests
        const pendingRequests = await db.connectionRequest.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
                status: "PENDING",
            },
            select: {
                senderId: true,
                receiverId: true,
            },
        })
        const pendingUserIds = new Set(
            pendingRequests.flatMap((r: any) => [r.senderId, r.receiverId]).filter((id: string) => id !== userId)
        )

        // Get user's skills for matching
        const userSkills = await db.userSkill.findMany({
            where: { userId },
            include: { skill: true },
        })
        const userSkillIds = new Set(userSkills.map((us: any) => us.skillId))

        // Find suggested users (not already connected, not pending, not self)
        const excludeIds = Array.from(new Set([userId, ...connectedUserIds, ...pendingUserIds]))
        const where: any = {
            id: {
                notIn: excludeIds,
            },
            role: "STUDENT", // Only suggest students for now
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                {
                    learnerProfile: {
                        OR: [
                            { currentJobTitle: { contains: search, mode: "insensitive" } },
                            { currentCompany: { contains: search, mode: "insensitive" } },
                            { university: { contains: search, mode: "insensitive" } },
                            { major: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
            ]
        }

        const suggestedUsers = await db.user.findMany({
            where,
            include: {
                learnerProfile: true,
                userSkills: {
                    include: {
                        skill: true,
                    },
                    take: 5,
                },
            },
            take: 20,
        })

        // Calculate mutual connections and match scores
        const suggestions = await Promise.all(
            suggestedUsers.map(async (user: any) => {
                // Count mutual connections
                const userConnections = await db.connection.findMany({
                    where: { userId: user.id },
                    select: { connectedUserId: true },
                })
                const userConnectedIds = new Set(userConnections.map((c: any) => c.connectedUserId))

                const myConnections = await db.connection.findMany({
                    where: { userId },
                    select: { connectedUserId: true },
                })
                const myConnectedIds = new Set(myConnections.map((c: any) => c.connectedUserId))

                const mutualCount = Array.from(userConnectedIds).filter((id) => myConnectedIds.has(id)).length

                // Calculate skill match percentage
                const userSkillIdsSet = new Set(user.userSkills.map((us: any) => us.skillId))
                const commonSkills = Array.from(userSkillIds).filter((id) => userSkillIdsSet.has(id))
                const matchScore = userSkillIds.size > 0 ? Math.round((commonSkills.length / userSkillIds.size) * 100) : 0

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.learnerProfile?.currentJobTitle || "Student",
                    company: user.learnerProfile?.currentCompany,
                    university: user.learnerProfile?.university,
                    mutualConnections: mutualCount,
                    matchScore,
                    skills: user.userSkills.map((us: any) => ({
                        id: us.skill.id,
                        name: us.skill.name,
                        level: us.level.toLowerCase(),
                    })),
                }
            })
        )

        // Sort by match score and mutual connections
        suggestions.sort((a: any, b: any) => {
            if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
            return b.mutualConnections - a.mutualConnections
        })

        return NextResponse.json({ suggestions })
    } catch (error: any) {
        console.error("Suggestions fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

