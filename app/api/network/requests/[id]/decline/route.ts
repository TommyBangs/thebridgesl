import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, AuthError } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const { id } = await params

    // Get the connection request
    const connectionRequest = await db.connectionRequest.findUnique({
      where: { id },
    })

    if (!connectionRequest) {
      return NextResponse.json(
        { error: "Connection request not found" },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ success: true, message: "Connection request declined" })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Decline connection request error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

