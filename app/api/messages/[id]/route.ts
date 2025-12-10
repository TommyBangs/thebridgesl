import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { id } = await params

        // Get messages between current user and the other user
        const messages = await db.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: id },
                    { senderId: id, receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                sentAt: "asc",
            },
        })

        // Mark messages as read
        await db.message.updateMany({
            where: {
                senderId: id,
                receiverId: userId,
                read: false,
            },
            data: {
                read: true,
            },
        })

        const formattedMessages = messages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            read: msg.read,
            sentAt: msg.sentAt.toISOString(),
            sender: {
                id: msg.sender.id,
                name: msg.sender.name,
                avatar: msg.sender.avatar,
            },
        }))

        return NextResponse.json({ messages: formattedMessages })
    } catch (error: any) {
        console.error("Conversation messages fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

