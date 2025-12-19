import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        // Fetch user skills to provide better recommendations
        const userSkills = await db.userSkill.findMany({
            where: { userId },
            include: { skill: true },
        })

        const skillNames = userSkills.map(us => us.skill.name)

        // Mock data for now, but structured to be replaced by AI/Market data later
        const recommendations = [
            { title: "AI/ML Engineer", demand: 95, growth: "+42%", avgSalary: 1450000, openings: 8934, matchScore: 94 },
            { title: "Full Stack Developer", demand: 88, growth: "+28%", avgSalary: 1200000, openings: 12453, matchScore: 89 },
            { title: "Data Scientist", demand: 92, growth: "+38%", avgSalary: 1350000, openings: 7621, matchScore: 91 },
            { title: "Cloud Architect", demand: 85, growth: "+35%", avgSalary: 1550000, openings: 5234, matchScore: 87 },
            { title: "DevOps Engineer", demand: 83, growth: "+30%", avgSalary: 1250000, openings: 6789, matchScore: 85 },
            { title: "Product Manager", demand: 80, growth: "+25%", avgSalary: 1400000, openings: 4521, matchScore: 82 },
        ]

        // Simple matching logic based on user skills
        const formattedRecommendations = recommendations.map(rec => {
            const matchCount = skillNames.filter(skill => rec.title.toLowerCase().includes(skill.toLowerCase())).length
            const adjustedMatchScore = Math.min(100, rec.matchScore + (matchCount * 5))
            return { ...rec, matchScore: adjustedMatchScore }
        })

        return NextResponse.json({ recommendations: formattedRecommendations })
    } catch (error: any) {
        console.error("Career recommendations error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
