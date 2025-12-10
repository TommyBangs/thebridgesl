import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, AuthError } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    // Get pending requests received by the user
    const requests = await db.connectionRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          include: {
            learnerProfile: true,
            connections: {
              where: {
                connectedUserId: userId,
              },
            },
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    })

    const formattedRequests = requests.map((req) => {
      const mutualConnections = req.sender.connections.length

      return {
        id: req.id,
        name: req.sender.name,
        email: req.sender.email,
        avatar: req.sender.avatar,
        role: req.sender.role,
        connectionType: "PEER", // Default, can be enhanced
        company: req.sender.learnerProfile?.currentCompany,
        university: req.sender.learnerProfile?.university,
        jobTitle: req.sender.learnerProfile?.currentJobTitle,
        message: req.message,
        mutualConnections,
        requestedAt: req.requestedAt,
      }
    })

    return NextResponse.json({ requests: formattedRequests })
  } catch (error: any) {
    console.error("Connection requests fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    const { receiverId, message, connectionType } = body

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      )
    }

    if (receiverId === userId) {
      return NextResponse.json(
        { error: "Cannot send connection request to yourself" },
        { status: 400 }
      )
    }

    // Check if connection already exists
    const existingConnection = await db.connection.findFirst({
      where: {
        OR: [
          { userId: userId, connectedUserId: receiverId },
          { userId: receiverId, connectedUserId: userId },
        ],
      },
    })

    if (existingConnection) {
      return NextResponse.json(
        { error: "Connection already exists" },
        { status: 400 }
      )
    }

    // Check if request already exists
    const existingRequest = await db.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
        status: "PENDING",
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "Connection request already sent" },
        { status: 400 }
      )
    }

    // Create connection request
    const connectionRequest = await db.connectionRequest.create({
      data: {
        senderId: userId,
        receiverId: receiverId,
        message: message || null,
        status: "PENDING",
      },
      include: {
        sender: {
          include: {
            learnerProfile: true,
          },
        },
        receiver: {
          include: {
            learnerProfile: true,
          },
        },
      },
    })

    return NextResponse.json({ request: connectionRequest }, { status: 201 })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Connection request creation error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

