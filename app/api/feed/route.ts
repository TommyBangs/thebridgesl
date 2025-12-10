import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "20")

        // Get feed items for the user
        const feedItems = await db.feedItem.findMany({
            where: { userId },
            orderBy: {
                timestamp: "desc",
            },
            take: limit,
        })

        const formattedFeedItems = feedItems.map((item: any) => ({
            id: item.id,
            type: item.type.toLowerCase().replace("_", "-"),
            priority: item.priority.toLowerCase(),
            title: item.title,
            description: item.description,
            image: item.image,
            data: item.data,
            timestamp: item.timestamp.toISOString(),
        }))

        return NextResponse.json({ feedItems: formattedFeedItems })
    } catch (error: any) {
        console.error("Feed fetch error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

