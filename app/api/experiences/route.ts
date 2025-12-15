import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  skills: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const experiences = await db.experience.findMany({
      where: { userId },
      include: {
        experienceSkills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json({ experiences })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Experiences fetch error:", error)
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

    const validatedData = experienceSchema.parse(body)

    // If current is true, endDate should be null
    const endDate = validatedData.current ? null : (validatedData.endDate ? new Date(validatedData.endDate) : null)

    const experience = await db.experience.create({
      data: {
        userId,
        title: validatedData.title,
        company: validatedData.company,
        location: validatedData.location,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate,
        current: validatedData.current,
        experienceSkills: validatedData.skills
          ? {
              create: validatedData.skills.map((skillId) => ({
                skillId,
              })),
            }
          : undefined,
      },
      include: {
        experienceSkills: {
          include: {
            skill: true,
          },
        },
      },
    })

    return NextResponse.json({ experience }, { status: 201 })
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
    console.error("Experience creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

