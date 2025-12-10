import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trending = searchParams.get("trending") === "true"
    const category = searchParams.get("category")

    const where: any = {}
    if (trending) {
      where.trending = true
    }
    if (category) {
      where.category = category.toUpperCase().replace("-", "_")
    }

    const skills = await db.skill.findMany({
      where,
      include: {
        trendingData: true,
      },
      orderBy: {
        name: "asc",
      },
      take: trending ? 10 : undefined,
    })

    // Sort by trending data if requested
    if (trending) {
      skills.sort((a, b) => {
        const aGrowth = a.trendingData?.growthRate ? Number(a.trendingData.growthRate) : 0
        const bGrowth = b.trendingData?.growthRate ? Number(b.trendingData.growthRate) : 0
        return bGrowth - aGrowth
      })
    }

    // Transform skills to match the expected format
    const transformedSkills = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category.toLowerCase().replace("_", "-") as any,
      level: "intermediate" as any, // Default level, can be enhanced later
      verified: skill.verified,
      endorsements: 0, // Can be calculated from user_skills later
      trending: skill.trendingData
        ? {
            demandPercentage: Number(skill.trendingData.demandPercentage),
            growthRate: Number(skill.trendingData.growthRate),
            averageSalary: Number(skill.trendingData.averageSalary),
            openPositions: skill.trendingData.openPositions,
          }
        : undefined,
    }))

    return NextResponse.json({ skills: transformedSkills })
  } catch (error) {
    console.error("Skills fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

