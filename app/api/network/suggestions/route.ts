import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    // Get user's existing connections
    const userConnections = await db.connection.findMany({
      where: {
        userId: userId,
      },
      select: {
        connectedUserId: true,
      },
    })
    const connectedUserIds = userConnections.map((c) => c.connectedUserId)

    // Get user's sent/received requests
    const userRequests = await db.connectionRequest.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    })
    const requestedUserIds = new Set([
      ...userRequests.map((r) => r.senderId),
      ...userRequests.map((r) => r.receiverId),
    ])
    requestedUserIds.delete(userId)

    // Get all users except current user, existing connections, and pending requests
    const excludeIds = [userId, ...connectedUserIds, ...Array.from(requestedUserIds)]

    const suggestions = await db.user.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
      },
      include: {
        learnerProfile: true,
        connections: {
          where: {
            connectedUserId: {
              in: connectedUserIds,
            },
          },
        },
      },
      take: 20,
    })

    const formattedSuggestions = suggestions.map((user) => {
      // Calculate mutual connections
      const mutualConnections = user.connections.length

      // Calculate match score based on shared skills, university, etc.
      let matchScore = 50 // Base score
      if (mutualConnections > 0) matchScore += mutualConnections * 10
      if (mutualConnections > 3) matchScore += 20

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        company: user.learnerProfile?.currentCompany,
        university: user.learnerProfile?.university,
        jobTitle: user.learnerProfile?.currentJobTitle,
        mutualConnections,
        matchScore: Math.min(matchScore, 100),
      }
    })

    // Sort by match score
    formattedSuggestions.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ suggestions: formattedSuggestions })
  } catch (error: any) {
    console.error("Suggestions fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

