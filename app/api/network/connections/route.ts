import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const connections = await db.connection.findMany({
      where: {
        userId: userId,
      },
      include: {
        connectedUser: {
          include: {
            learnerProfile: true,
          },
        },
      },
      orderBy: {
        connectedAt: "desc",
      },
    })

    const formattedConnections = connections.map((conn) => ({
      id: conn.id,
      name: conn.connectedUser.name,
      email: conn.connectedUser.email,
      avatar: conn.connectedUser.avatar,
      role: conn.connectedUser.role,
      connectionType: conn.type,
      mutualConnections: conn.mutualConnections,
      connectedAt: conn.connectedAt,
      company: conn.connectedUser.learnerProfile?.currentCompany,
      university: conn.connectedUser.learnerProfile?.university,
      jobTitle: conn.connectedUser.learnerProfile?.currentJobTitle,
    }))

    return NextResponse.json({ connections: formattedConnections })
  } catch (error: any) {
    console.error("Connections fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

