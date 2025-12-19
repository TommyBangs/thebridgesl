import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { id } = await params

        // Verify notification belongs to user
        const notification = await db.notification.findUnique({
            where: { id },
        })

        if (!notification) {
            return NextResponse.json(
                { error: "Notification not found" },
                { status: 404 }
            )
        }

        if (notification.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await db.notification.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Notification delete error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
