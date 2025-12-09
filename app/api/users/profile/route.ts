import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        learnerProfile: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
        credentials: {
          include: {
            credentialSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
        projects: {
          include: {
            projectSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    const { name, bio, location, university, major, graduationYear, avatar } = body

    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        learnerProfile: {
          upsert: {
            create: {
              ...(bio && { bio }),
              ...(location && { location }),
              ...(university && { university }),
              ...(major && { major }),
              ...(graduationYear && { graduationYear }),
              skillsMatchPercentage: 0,
              verificationStatus: "UNVERIFIED",
            },
            update: {
              ...(bio !== undefined && { bio }),
              ...(location !== undefined && { location }),
              ...(university !== undefined && { university }),
              ...(major !== undefined && { major }),
              ...(graduationYear !== undefined && { graduationYear }),
            },
          },
        },
      },
      include: {
        learnerProfile: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

