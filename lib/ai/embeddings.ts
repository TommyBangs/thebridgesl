/**
 * Embedding Generation Service
 * Generates and caches embeddings for entities using OpenAI
 */

import { getOpenAIClient, getOpenAIModels, withRetry, logAPICall } from "@/lib/openai"
import { db } from "@/lib/db"
import crypto from "crypto"

// In-memory cache (use Redis in production)
const embeddingCache = new Map<string, { embedding: number[]; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Hash text for cache key
 */
function hashText(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex")
}

/**
 * Get cached embedding if available
 */
function getCachedEmbedding(text: string): number[] | null {
    const key = hashText(text)
    const cached = embeddingCache.get(key)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.embedding
    }

    // Remove expired entry
    if (cached) {
        embeddingCache.delete(key)
    }

    return null
}

/**
 * Cache embedding
 */
function cacheEmbedding(text: string, embedding: number[]): void {
    const key = hashText(text)
    embeddingCache.set(key, {
        embedding,
        timestamp: Date.now(),
    })
}

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string, useCache: boolean = true): Promise<number[]> {
    // Check cache first
    if (useCache) {
        const cached = getCachedEmbedding(text)
        if (cached) {
            return cached
        }
    }

    const models = getOpenAIModels()
    const client = getOpenAIClient()

    try {
        const response = await withRetry(async () => {
            return await client.embeddings.create({
                model: models.embedding,
                input: text,
            })
        })

        const embedding = response.data[0]?.embedding
        if (!embedding) {
            throw new Error("No embedding in OpenAI response")
        }

        // Cache the result
        if (useCache) {
            cacheEmbedding(text, embedding)
        }

        // Log API call (approximate token count: text length / 4)
        const inputTokens = Math.ceil(text.length / 4)
        logAPICall(models.embedding, inputTokens, 0, true)

        return embedding
    } catch (error: any) {
        logAPICall(models.embedding, 0, 0, false, error.message)
        throw new Error(`Failed to generate embedding: ${error.message}`)
    }
}

/**
 * Construct text representation of entity for embedding
 */
export function constructEntityText(
    type: "user" | "skill" | "opportunity" | "project",
    data: any
): string {
    switch (type) {
        case "user": {
            const parts: string[] = []
            if (data.name) parts.push(`Name: ${data.name}`)
            if (data.bio) parts.push(`Bio: ${data.bio}`)
            if (data.location) parts.push(`Location: ${data.location}`)
            if (data.currentJobTitle) parts.push(`Job Title: ${data.currentJobTitle}`)
            if (data.currentCompany) parts.push(`Company: ${data.currentCompany}`)
            if (data.university) parts.push(`University: ${data.university}`)
            if (data.major) parts.push(`Major: ${data.major}`)
            if (data.skills && Array.isArray(data.skills)) {
                parts.push(`Skills: ${data.skills.map((s: any) => s.name || s).join(", ")}`)
            }
            return parts.join(". ")
        }

        case "skill": {
            const parts: string[] = []
            if (data.name) parts.push(data.name)
            if (data.description) parts.push(data.description)
            if (data.category) parts.push(`Category: ${data.category}`)
            return parts.join(". ")
        }

        case "opportunity": {
            const parts: string[] = []
            if (data.title) parts.push(`Title: ${data.title}`)
            if (data.company) parts.push(`Company: ${data.company}`)
            if (data.description) parts.push(`Description: ${data.description}`)
            if (data.location) parts.push(`Location: ${data.location}`)
            if (data.type) parts.push(`Type: ${data.type}`)
            if (data.skills && Array.isArray(data.skills)) {
                parts.push(`Required Skills: ${data.skills.map((s: any) => s.name || s).join(", ")}`)
            }
            return parts.join(". ")
        }

        case "project": {
            const parts: string[] = []
            if (data.title) parts.push(`Title: ${data.title}`)
            if (data.description) parts.push(`Description: ${data.description}`)
            if (data.skills && Array.isArray(data.skills)) {
                parts.push(`Technologies: ${data.skills.map((s: any) => s.name || s).join(", ")}`)
            }
            return parts.join(". ")
        }

        default:
            return ""
    }
}

/**
 * Update entity embedding in database
 */
export async function updateEntityEmbedding(
    type: "user" | "skill" | "opportunity" | "project",
    entityId: string,
    data: any
): Promise<void> {
    try {
        // Construct text representation
        const text = constructEntityText(type, data)
        if (!text.trim()) {
            console.warn(`[Embeddings] Empty text for ${type} ${entityId}, skipping embedding generation`)
            return
        }

        // Generate embedding
        const embedding = await generateEmbedding(text)

        // Update database using raw SQL (Prisma doesn't support vector writes natively)
        const tableMap: Record<typeof type, string> = {
            user: "users",
            skill: "skills",
            opportunity: "opportunities",
            project: "projects",
        }

        const table = tableMap[type]
        const embeddingArray = `[${embedding.join(",")}]`

        await db.$executeRawUnsafe(
            `UPDATE ${table} SET embedding = $1::vector WHERE id = $2`,
            embeddingArray,
            entityId
        )

        console.log(`[Embeddings] Updated embedding for ${type} ${entityId}`)
    } catch (error: any) {
        // Log error but don't block entity creation
        console.error(`[Embeddings] Failed to update embedding for ${type} ${entityId}:`, error.message)
    }
}

/**
 * Check if entity text has changed (by comparing hash)
 */
export async function shouldUpdateEmbedding(
    type: "user" | "skill" | "opportunity" | "project",
    entityId: string,
    newData: any
): Promise<boolean> {
    // For MVP, always update (can be optimized later by storing text hash)
    return true
}

