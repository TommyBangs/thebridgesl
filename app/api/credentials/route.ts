import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

const credentialSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  type: z.enum(["CERTIFICATION", "DEGREE", "BADGE", "COURSE_COMPLETION", "PROJECT"]),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const credentials = await db.credential.findMany({
      where: { userId },
      include: {
        credentialSkills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        issueDate: "desc",
      },
    })

    return NextResponse.json({ credentials })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Credentials fetch error:", error)
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

    const validatedData = credentialSchema.parse(body)

    const credential = await db.credential.create({
      data: {
        userId,
        title: validatedData.title,
        issuer: validatedData.issuer,
        type: validatedData.type,
        issueDate: new Date(validatedData.issueDate),
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        credentialSkills: validatedData.skills
          ? {
              create: validatedData.skills.map((skillId) => ({
                skillId,
              })),
            }
          : undefined,
      },
      include: {
        credentialSkills: {
          include: {
            skill: true,
          },
        },
      },
    })

    return NextResponse.json({ credential }, { status: 201 })
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
    console.error("Credential creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

