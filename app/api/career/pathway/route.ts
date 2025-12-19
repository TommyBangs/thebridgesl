import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const pathwaySchema = z.object({
    goal: z.string().min(1),
})

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const body = await request.json()
        const { goal } = pathwaySchema.parse(body)

        // In a real app, this would call an AI service (OpenAI/Gemini)
        // For the MVP, we'll generate a structured response based on the goal

        const pathway = [
            {
                stage: 1,
                title: "Foundation",
                description: "Building core skills and knowledge base",
                progress: 100,
                status: "current",
            },
            {
                stage: 2,
                title: `Learn ${goal} Essentials`,
                description: "Master fundamental concepts and tools",
                progress: 65,
                status: "current",
            },
            {
                stage: 3,
                title: `Build ${goal} Experience`,
                description: "Real-world projects and practical application",
                progress: 0,
                status: "upcoming",
            },
            {
                stage: 4,
                title: `Advance ${goal} Expertise`,
                description: "Specialization and professional networking",
                progress: 0,
                status: "future",
            },
            {
                stage: 5,
                title: `Master ${goal}`,
                description: "Leadership and industry recognition",
                progress: 0,
                status: "future",
            },
        ]

        return NextResponse.json({ pathway })
    } catch (error: any) {
        console.error("Pathway generation error:", error)
        if (error.status === 401) {
            return error
        }
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
