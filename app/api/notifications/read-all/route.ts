import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function PUT(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        await db.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Mark all notifications as read error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

