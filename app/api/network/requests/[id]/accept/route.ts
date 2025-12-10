import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { id } = await params

        // Find the connection request
        const connectionRequest = await db.connectionRequest.findUnique({
            where: { id },
            include: {
                sender: true,
                receiver: true,
            },
        })

        if (!connectionRequest) {
            return NextResponse.json(
                { error: "Connection request not found" },
                { status: 404 }
            )
        }

        // Verify the user is the receiver
        if (connectionRequest.receiverId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        if (connectionRequest.status !== "PENDING") {
            return NextResponse.json(
                { error: "Connection request already processed" },
                { status: 400 }
            )
        }

        // Use transaction to update request and create connection
        const result = await db.$transaction(async (tx: any) => {
            // Update request status
            await tx.connectionRequest.update({
                where: { id },
                data: {
                    status: "ACCEPTED",
                    respondedAt: new Date(),
                },
            })

            // Calculate mutual connections
            const senderConnections = await tx.connection.findMany({
                where: { userId: connectionRequest.senderId },
                select: { connectedUserId: true },
            })
            const receiverConnections = await tx.connection.findMany({
                where: { userId: connectionRequest.receiverId },
                select: { connectedUserId: true },
            })

            const senderConnectedIds = new Set(senderConnections.map((c: any) => c.connectedUserId))
            const receiverConnectedIds = new Set(receiverConnections.map((c: any) => c.connectedUserId))
            const mutualCount = Array.from(senderConnectedIds).filter((id) => receiverConnectedIds.has(id)).length

            // Create bidirectional connections
            await tx.connection.createMany({
                data: [
                    {
                        userId: connectionRequest.senderId,
                        connectedUserId: connectionRequest.receiverId,
                        type: "PEER",
                        mutualConnections: mutualCount,
                    },
                    {
                        userId: connectionRequest.receiverId,
                        connectedUserId: connectionRequest.senderId,
                        type: "PEER",
                        mutualConnections: mutualCount,
                    },
                ],
                skipDuplicates: true,
            })

            return { success: true }
        })

        return NextResponse.json({ success: true, message: "Connection accepted" })
    } catch (error: any) {
        console.error("Accept connection error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

