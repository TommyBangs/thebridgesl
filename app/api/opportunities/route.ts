import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const remote = searchParams.get("remote") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (type) {
      where.type = type.toUpperCase()
    }
    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }
    if (remote) {
      where.remote = true
    }

    const opportunities = await db.opportunity.findMany({
      where,
      include: {
        opportunitySkills: {
          include: {
            skill: true,
          },
        },
        requirements: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
      orderBy: {
        postedDate: "desc",
      },
      take: limit,
    })

    // Calculate match scores if user is authenticated
    const session = await auth().catch(() => null)
    if (session?.user) {
      const userId = session.user.id
      const userSkills = await db.userSkill.findMany({
        where: { userId },
        select: { skillId: true },
      })
      const userSkillIds = new Set(userSkills.map((us) => us.skillId))

      const opportunitiesWithScores = opportunities.map((opp) => {
        const requiredSkills = opp.opportunitySkills.map((os) => os.skillId)
        const matchedSkills = requiredSkills.filter((skillId) =>
          userSkillIds.has(skillId)
        )
        const matchScore = requiredSkills.length
          ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
          : 0

        return {
          id: opp.id,
          title: opp.title,
          company: opp.company,
          companyLogo: opp.companyLogo || undefined,
          type: opp.type.toLowerCase() as any,
          location: opp.location,
          remote: opp.remote,
          description: opp.description,
          requirements: opp.requirements.map((r) => r.requirement),
          skills: opp.opportunitySkills.map((os) => os.skill.name),
          matchScore,
          salary: opp.salaryMin && opp.salaryMax
            ? {
                min: Number(opp.salaryMin),
                max: Number(opp.salaryMax),
                currency: "SLL",
              }
            : undefined,
          postedDate: opp.postedDate.toISOString(),
          deadline: opp.deadline?.toISOString(),
          applicationUrl: opp.applicationUrl || undefined,
        }
      })

      return NextResponse.json({
        opportunities: opportunitiesWithScores.sort(
          (a, b) => b.matchScore - a.matchScore
        ),
      })
    }

    // Transform opportunities to match expected format
    const transformedOpportunities = opportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      company: opp.company,
      companyLogo: opp.companyLogo || undefined,
      type: opp.type.toLowerCase() as any,
      location: opp.location,
      remote: opp.remote,
      description: opp.description,
      requirements: opp.requirements.map((r) => r.requirement),
      skills: opp.opportunitySkills.map((os) => os.skill.name),
      matchScore: 0, // No match score for unauthenticated users
      salary: opp.salaryMin && opp.salaryMax
        ? {
            min: Number(opp.salaryMin),
            max: Number(opp.salaryMax),
            currency: "SLL",
          }
        : undefined,
      postedDate: opp.postedDate.toISOString(),
      deadline: opp.deadline?.toISOString(),
      applicationUrl: opp.applicationUrl || undefined,
    }))

    return NextResponse.json({ opportunities: transformedOpportunities })
  } catch (error) {
    console.error("Opportunities fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

