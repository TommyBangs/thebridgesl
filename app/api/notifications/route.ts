import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, AuthError } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    const where: any = {
      userId: userId,
    }

    if (filter === "unread") {
      where.read = false
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
    })

    return NextResponse.json({ notifications })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    const { action } = body

    if (action === "mark-all-read") {
      await db.notification.updateMany({
        where: {
          userId: userId,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({ success: true, message: "All notifications marked as read" })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Mark notifications as read error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

