import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

const userSkillSchema = z.object({
  skillId: z.string().uuid(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const userSkills = await db.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            trendingData: true,
          },
        },
      },
      orderBy: {
        addedAt: "desc",
      },
    })

    return NextResponse.json({ userSkills })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("User skills fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    const validatedData = userSkillSchema.parse(body)

    // Check if skill already exists for user
    const existing = await db.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId: validatedData.skillId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Skill already added" },
        { status: 400 }
      )
    }

    const userSkill = await db.userSkill.create({
      data: {
        userId,
        skillId: validatedData.skillId,
        level: validatedData.level,
      },
      include: {
        skill: {
          include: {
            trendingData: true,
          },
        },
      },
    })

    return NextResponse.json({ userSkill }, { status: 201 })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("User skill creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get("skillId")

    if (!skillId) {
      return NextResponse.json(
        { error: "skillId is required" },
        { status: 400 }
      )
    }

    await db.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    })

    return NextResponse.json({ message: "Skill removed" })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("User skill deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

