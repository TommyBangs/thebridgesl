import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const requestSchema = z.object({
    receiverId: z.string().uuid(),
    message: z.string().optional(),
})

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "received" // "sent" or "received"

        const where: any =
            type === "sent"
                ? { senderId: userId, status: "PENDING" }
                : { receiverId: userId, status: "PENDING" }

        const requests = await db.connectionRequest.findMany({
            where,
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
            orderBy: {
                requestedAt: "desc",
            },
        })

        const formattedRequests = requests.map((req: any) => {
            const user = type === "sent" ? req.receiver : req.sender
            return {
                id: req.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.learnerProfile?.currentJobTitle || "Student",
                company: user.learnerProfile?.currentCompany,
                connectionType: "peer", // Default, can be enhanced
                mutualConnections: 0, // Can be calculated if needed
                message: req.message,
                requestedAt: req.requestedAt.toISOString(),
                senderId: req.senderId,
                receiverId: req.receiverId,
            }
        })

        return NextResponse.json({ requests: formattedRequests })
    } catch (error: any) {
        console.error("Connection requests fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        const body = await request.json()
        const { receiverId, message } = requestSchema.parse(body)

        // Check if already connected
        const existingConnection = await db.connection.findFirst({
            where: {
                OR: [
                    { userId, connectedUserId: receiverId },
                    { userId: receiverId, connectedUserId: userId },
                ],
            },
        })

        if (existingConnection) {
            return NextResponse.json(
                { error: "Already connected" },
                { status: 400 }
            )
        }

        // Check if request already exists
        const existingRequest = await db.connectionRequest.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId },
                    { senderId: receiverId, receiverId: userId },
                ],
                status: "PENDING",
            },
        })

        if (existingRequest) {
            return NextResponse.json(
                { error: "Connection request already exists" },
                { status: 400 }
            )
        }

        // Create connection request
        const connectionRequest = await db.connectionRequest.create({
            data: {
                senderId: userId,
                receiverId,
                message: message || null,
                status: "PENDING",
            },
            include: {
                receiver: {
                    include: {
                        learnerProfile: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                request: {
                    id: connectionRequest.id,
                    receiverId: connectionRequest.receiverId,
                    message: connectionRequest.message,
                    requestedAt: connectionRequest.requestedAt.toISOString(),
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Connection request creation error:", error)
        if (error.status === 401) {
            return error
        }
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

