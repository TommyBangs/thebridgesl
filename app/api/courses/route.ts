import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const level = searchParams.get("level")
        const limit = parseInt(searchParams.get("limit") || "20")

        const where: any = {}
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { provider: { contains: search, mode: "insensitive" } },
            ]
        }
        if (level) {
            where.level = level.toUpperCase()
        }

        const courses = await db.course.findMany({
            where,
            include: {
                courseSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
            orderBy: {
                rating: "desc",
            },
            take: limit,
        })

        const formattedCourses = courses.map((course: any) => ({
            id: course.id,
            title: course.title,
            provider: course.provider,
            description: course.description,
            thumbnail: course.thumbnail,
            duration: course.duration,
            level: course.level.toLowerCase(),
            rating: Number(course.rating),
            reviewCount: course.reviewCount,
            price: Number(course.price),
            url: course.url,
            skills: course.courseSkills.map((cs: any) => ({
                id: cs.skill.id,
                name: cs.skill.name,
            })),
        }))

        return NextResponse.json({ courses: formattedCourses })
    } catch (error: any) {
        console.error("Courses fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

