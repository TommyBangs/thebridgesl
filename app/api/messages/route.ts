import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const messageSchema = z.object({
    receiverId: z.string().uuid(),
    content: z.string().min(1),
})

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        // Get all conversations (users the current user has messaged or received messages from)
        const sentMessages = await db.message.findMany({
            where: { senderId: userId },
            select: { receiverId: true },
            distinct: ["receiverId"],
        })

        const receivedMessages = await db.message.findMany({
            where: { receiverId: userId },
            select: { senderId: true },
            distinct: ["senderId"],
        })

        const conversationUserIds = new Set([
            ...sentMessages.map((m: any) => m.receiverId),
            ...receivedMessages.map((m: any) => m.senderId),
        ])

        // Get latest message for each conversation
        const conversations = await Promise.all(
            Array.from(conversationUserIds).map(async (otherUserId) => {
                const latestMessage = await db.message.findFirst({
                    where: {
                        OR: [
                            { senderId: userId, receiverId: otherUserId },
                            { senderId: otherUserId, receiverId: userId },
                        ],
                    },
                    orderBy: { sentAt: "desc" },
                })

                const otherUser = await db.user.findUnique({
                    where: { id: otherUserId },
                    include: {
                        learnerProfile: true,
                    },
                })

                const unreadCount = await db.message.count({
                    where: {
                        senderId: otherUserId,
                        receiverId: userId,
                        read: false,
                    },
                })

                return {
                    id: otherUserId,
                    user: {
                        id: otherUser?.id,
                        name: otherUser?.name,
                        avatar: otherUser?.avatar,
                        role: otherUser?.learnerProfile?.currentJobTitle || "Student",
                    },
                    latestMessage: latestMessage
                        ? {
                            id: latestMessage.id,
                            content: latestMessage.content,
                            sentAt: latestMessage.sentAt.toISOString(),
                            read: latestMessage.read,
                        }
                        : null,
                    unreadCount,
                }
            })
        )

        // Sort by latest message time
        conversations.sort((a, b) => {
            if (!a.latestMessage) return 1
            if (!b.latestMessage) return -1
            return new Date(b.latestMessage.sentAt).getTime() - new Date(a.latestMessage.sentAt).getTime()
        })

        return NextResponse.json({ conversations })
    } catch (error: any) {
        console.error("Messages fetch error:", error)
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
        const { receiverId, content } = messageSchema.parse(body)

        // Verify users are connected (optional check - can be removed if messaging should be open)
        const areConnected = await db.connection.findFirst({
            where: {
                OR: [
                    { userId, connectedUserId: receiverId },
                    { userId: receiverId, connectedUserId: userId },
                ],
            },
        })

        // Allow messaging even if not connected (can be changed based on requirements)
        // if (!areConnected) {
        //   return NextResponse.json(
        //     { error: "Users must be connected to message" },
        //     { status: 403 }
        //   )
        // }

        const message = await db.message.create({
            data: {
                senderId: userId,
                receiverId,
                content,
                read: false,
            },
        })

        return NextResponse.json(
            {
                message: {
                    id: message.id,
                    content: message.content,
                    sentAt: message.sentAt.toISOString(),
                    read: message.read,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Send message error:", error)
        if (error.status === 401) {
            return error
        }
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid message data", details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

