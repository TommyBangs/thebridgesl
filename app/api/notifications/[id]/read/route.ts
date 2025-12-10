import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { id } = await params

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
                { status: 403 }
            )
        }

        await db.notification.update({
            where: { id },
            data: { read: true },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Mark notification as read error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

