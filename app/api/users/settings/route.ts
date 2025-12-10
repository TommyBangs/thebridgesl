import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, AuthError } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return default settings (can be extended with a Settings model later)
    return NextResponse.json({
      settings: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailNotifications: true, // Default
        pushNotifications: true, // Default
        profileVisibility: "PUBLIC", // Default
      },
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Settings fetch error:", error)
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

    const { name, email, avatar, emailNotifications, pushNotifications, profileVisibility } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (avatar !== undefined) updateData.avatar = avatar

    await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Settings like emailNotifications, pushNotifications, profileVisibility
    // can be stored in a separate Settings model or in user preferences JSON field
    // For now, we'll just update the basic user fields

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        name: updateData.name,
        email: updateData.email,
        avatar: updateData.avatar,
        emailNotifications: emailNotifications ?? true,
        pushNotifications: pushNotifications ?? true,
        profileVisibility: profileVisibility ?? "PUBLIC",
      },
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Settings update error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

