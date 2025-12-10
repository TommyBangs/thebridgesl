import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

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
          where: {
            visibility: "PUBLIC",
          },
          include: {
            credentialSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
        projects: {
          where: {
            visibility: "PUBLIC",
          },
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

    // Remove sensitive information
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    console.error("Public profile fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

