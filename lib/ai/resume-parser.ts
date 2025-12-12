/**
 * Resume Parser Service
 * Extracts structured data from resume text using OpenAI
 */

import { getOpenAIClient, getOpenAIModels, withRetry, logAPICall } from "@/lib/openai"
import { z } from "zod"

/**
 * Schema for parsed resume data
 */
export const ParsedResumeSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string().optional(),
        field: z.string().optional(),
        graduationYear: z.string().optional(),
      })
    )
    .optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
      })
    )
    .optional(),
})

export type ParsedResume = z.infer<typeof ParsedResumeSchema>

/**
 * Sanitize input text by removing PII
 */
export function sanitizeInput(text: string): { sanitized: string; removed: string[] } {
  const removed: string[] = []

  // Email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  let sanitized = text.replace(emailPattern, (match) => {
    removed.push(`email: ${match}`)
    return "[EMAIL_REDACTED]"
  })

  // Phone pattern (various formats)
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  sanitized = sanitized.replace(phonePattern, (match) => {
    removed.push(`phone: ${match}`)
    return "[PHONE_REDACTED]"
  })

  // SSN pattern (XXX-XX-XXXX)
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g
  sanitized = sanitized.replace(ssnPattern, (match) => {
    removed.push(`ssn: ${match}`)
    return "[SSN_REDACTED]"
  })

  // Credit card pattern (basic)
  const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
  sanitized = sanitized.replace(ccPattern, (match) => {
    removed.push(`credit_card: ${match}`)
    return "[CC_REDACTED]"
  })

  return { sanitized, removed }
}

/**
 * Parse resume text using OpenAI
 */
export async function parseResume(text: string): Promise<ParsedResume> {
  const { sanitized, removed } = sanitizeInput(text)

  if (removed.length > 0) {
    console.log(`[Resume Parser] Removed ${removed.length} PII items:`, removed.slice(0, 5))
  }

  const models = getOpenAIModels()
  const client = getOpenAIClient()

  const systemPrompt = `You are a professional resume parser. Extract structured information from the resume text provided.

Extract the following information:
- name: Full name of the person
- bio: Professional summary or objective (if available)
- email: Email address (if not redacted)
- phone: Phone number (if not redacted)
- location: City, State/Country
- skills: Array of technical and soft skills mentioned
- experience: Array of work experience with title, company, duration, and description
- education: Array of educational background with degree, institution, field, and graduation year
- certifications: Array of certifications and licenses
- languages: Array of languages spoken
- projects: Array of notable projects with name, description, and technologies used

Return ONLY valid JSON. Do not include any personal identifying information that was redacted.
If a field is not found, omit it from the response (don't include null or empty values).`

  try {
    const response = await withRetry(async () => {
      return await client.chat.completions.create({
        model: models.llm,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitized },
        ],
        response_format: { type: "json_object" },
        temperature: 0.0, // Deterministic
        max_tokens: models.maxTokens,
      })
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content in OpenAI response")
    }

    // Parse JSON response
    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError}`)
    }

    // Validate against schema
    const validated = ParsedResumeSchema.parse(parsed)

    // Log API call
    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    logAPICall(models.llm, inputTokens, outputTokens, true)

    return validated
  } catch (error: any) {
    // Log error
    const models = getOpenAIModels()
    logAPICall(models.llm, 0, 0, false, error.message)

    if (error instanceof z.ZodError) {
      throw new Error(`Invalid resume data structure: ${error.errors.map((e) => e.message).join(", ")}`)
    }

    throw new Error(`Failed to parse resume: ${error.message}`)
  }
}




