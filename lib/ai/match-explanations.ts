/**
 * Match Explanations Service
 * Generates AI-powered explanations for why opportunities match users
 */

import { getOpenAIClient, getOpenAIModels, withRetry, logAPICall } from "@/lib/openai"
import { z } from "zod"

const MatchExplanationSchema = z.object({
    explanation: z.string(),
    confidence: z.number().min(0).max(1).optional(),
})

export type MatchExplanation = z.infer<typeof MatchExplanationSchema>

/**
 * Generate match explanation for an opportunity
 */
export async function generateMatchExplanation(
    userProfile: {
        name: string
        skills: string[]
        location?: string
        currentJobTitle?: string
        currentCompany?: string
        university?: string
        major?: string
    },
    opportunity: {
        title: string
        company: string
        description: string
        location: string
        remote: boolean
        requiredSkills: string[]
    }
): Promise<MatchExplanation> {
    const models = getOpenAIModels()
    const client = getOpenAIClient()

    const systemPrompt = `You are a career advisor. Explain why a job opportunity is a good match for a user in ONE concise sentence (max 20 words). 
Focus on:
- Skill alignment
- Location compatibility
- Career progression fit

Be specific and encouraging. Return JSON with "explanation" (string) and optional "confidence" (0-1).`

    const userPrompt = `User Profile:
- Name: ${userProfile.name}
- Skills: ${userProfile.skills.join(", ")}
- Location: ${userProfile.location || "Not specified"}
- Current Role: ${userProfile.currentJobTitle || "Not specified"}
- Company: ${userProfile.currentCompany || "Not specified"}
- Education: ${userProfile.university || ""} ${userProfile.major || ""}

Job Opportunity:
- Title: ${opportunity.title}
- Company: ${opportunity.company}
- Location: ${opportunity.location} ${opportunity.remote ? "(Remote)" : ""}
- Required Skills: ${opportunity.requiredSkills.join(", ")}
- Description: ${opportunity.description.substring(0, 500)}

Explain why this job is a good match.`

    try {
        const response = await withRetry(async () => {
            return await client.chat.completions.create({
                model: models.llm,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
                temperature: 0.3, // Slightly creative but consistent
                max_tokens: 150, // Short explanation
            })
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error("No content in OpenAI response")
        }

        const parsed = JSON.parse(content)
        const validated = MatchExplanationSchema.parse(parsed)

        // Log API call
        const inputTokens = response.usage?.prompt_tokens || 0
        const outputTokens = response.usage?.completion_tokens || 0
        logAPICall(models.llm, inputTokens, outputTokens, true)

        return validated
    } catch (error: any) {
        // Log error
        const models = getOpenAIModels()
        logAPICall(models.llm, 0, 0, false, error.message)

        // Return fallback explanation
        return {
            explanation: "This opportunity matches your skills and experience.",
            confidence: 0.5,
        }
    }
}

