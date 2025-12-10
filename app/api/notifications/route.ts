import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get("unread") === "true"

        const where: any = { userId }
        if (unreadOnly) {
            where.read = false
        }

        const notifications = await db.notification.findMany({
            where,
            orderBy: {
                timestamp: "desc",
            },
            take: 100,
        })

        const formattedNotifications = notifications.map((notif: any) => ({
            id: notif.id,
            type: notif.type.toLowerCase(),
            title: notif.title,
            message: notif.message,
            read: notif.read,
            actionUrl: notif.actionUrl,
            icon: notif.icon,
            timestamp: notif.timestamp.toISOString(),
        }))

        return NextResponse.json({ notifications: formattedNotifications })
    } catch (error: any) {
        console.error("Notifications fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

