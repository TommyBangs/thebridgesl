import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

const applicationSchema = z.object({
  opportunityId: z.string().uuid(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const applications = await db.application.findMany({
      where: { userId },
      include: {
        opportunity: {
          include: {
            opportunitySkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    })

    return NextResponse.json({ applications })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Applications fetch error:", error)
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

    const validatedData = applicationSchema.parse(body)

    // Check if already applied
    const existing = await db.application.findUnique({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId: validatedData.opportunityId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Already applied to this opportunity" },
        { status: 400 }
      )
    }

    const application = await db.application.create({
      data: {
        userId,
        opportunityId: validatedData.opportunityId,
        coverLetter: validatedData.coverLetter,
        resumeUrl: validatedData.resumeUrl,
        status: "APPLIED",
      },
      include: {
        opportunity: {
          include: {
            opportunitySkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ application }, { status: 201 })
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
    console.error("Application creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

