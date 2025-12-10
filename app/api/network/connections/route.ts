import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        const connections = await db.connection.findMany({
            where: {
                userId,
            },
            include: {
                connectedUser: {
                    include: {
                        learnerProfile: true,
                        userSkills: {
                            include: {
                                skill: true,
                            },
                            take: 5,
                        },
                    },
                },
            },
            orderBy: {
                connectedAt: "desc",
            },
        })

        const formattedConnections = connections.map((conn: any) => ({
            id: conn.connectedUser.id,
            name: conn.connectedUser.name,
            email: conn.connectedUser.email,
            avatar: conn.connectedUser.avatar,
            role: conn.connectedUser.learnerProfile?.currentJobTitle || "Student",
            company: conn.connectedUser.learnerProfile?.currentCompany,
            university: conn.connectedUser.learnerProfile?.university,
            connectionType: conn.type.toLowerCase(),
            mutualConnections: conn.mutualConnections,
            connectedAt: conn.connectedAt.toISOString(),
            skills: conn.connectedUser.userSkills.map((us: any) => ({
                id: us.skill.id,
                name: us.skill.name,
                level: us.level.toLowerCase(),
            })),
        }))

        return NextResponse.json({ connections: formattedConnections })
    } catch (error: any) {
        console.error("Connections fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

