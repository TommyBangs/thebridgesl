import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(z.string()).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "CONNECTIONS"]).default("PUBLIC"),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")

    const where: any = {
      OR: [
        { userId },
        { visibility: "PUBLIC" },
        {
          AND: [
            { visibility: "CONNECTIONS" },
            {
              user: {
                connections: {
                  some: {
                    connectedUserId: userId,
                  },
                },
              },
            },
          ],
        },
      ],
    }

    if (userIdParam) {
      where.userId = userIdParam
    }

    const projects = await db.project.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        projectSkills: {
          include: {
            skill: true,
          },
        },
        media: true,
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        endorsements: {
          include: {
            endorser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ projects })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Projects fetch error:", error)
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

    const validatedData = projectSchema.parse(body)

    const project = await db.project.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        visibility: validatedData.visibility,
        githubUrl: validatedData.githubUrl,
        liveUrl: validatedData.liveUrl,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        projectSkills: validatedData.skills
          ? {
              create: validatedData.skills.map((skillId) => ({
                skillId,
              })),
            }
          : undefined,
      },
      include: {
        projectSkills: {
          include: {
            skill: true,
          },
        },
      },
    })

    return NextResponse.json({ project }, { status: 201 })
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
    console.error("Project creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

