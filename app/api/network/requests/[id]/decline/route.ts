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

        // Update request status
        await db.connectionRequest.update({
            where: { id },
            data: {
                status: "DECLINED",
                respondedAt: new Date(),
            },
        })

        return NextResponse.json({ success: true, message: "Connection declined" })
    } catch (error: any) {
        console.error("Decline connection error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

