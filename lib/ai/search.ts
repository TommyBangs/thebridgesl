/**
 * Semantic Search Service
 * Performs vector similarity search using embeddings
 */

import { generateEmbedding } from "./embeddings"
import { db } from "@/lib/db"

export type SearchType = "users" | "skills" | "opportunities" | "projects" | "all"

interface SearchResult<T> {
    item: T
    similarity: number
}

/**
 * Perform semantic search on a specific entity type
 */
export async function semanticSearch<T>(
    query: string,
    type: SearchType,
    limit: number = 10
): Promise<SearchResult<T>[]> {
    try {
        // Generate embedding for query
        const queryEmbedding = await generateEmbedding(query)
        const embeddingArray = `[${queryEmbedding.join(",")}]`

        let results: SearchResult<T>[] = []

        if (type === "users" || type === "all") {
            const users = await db.$queryRawUnsafe<Array<T & { similarity: number }>>(
                `SELECT *, 1 - (embedding <=> $1::vector) as similarity 
         FROM users 
         WHERE embedding IS NOT NULL 
         ORDER BY similarity DESC 
         LIMIT $2`,
                embeddingArray,
                limit
            )
            results.push(...users.map((u) => ({ item: u as T, similarity: u.similarity })))
        }

        if (type === "skills" || type === "all") {
            const skills = await db.$queryRawUnsafe<Array<T & { similarity: number }>>(
                `SELECT *, 1 - (embedding <=> $1::vector) as similarity 
         FROM skills 
         WHERE embedding IS NOT NULL 
         ORDER BY similarity DESC 
         LIMIT $2`,
                embeddingArray,
                limit
            )
            results.push(...skills.map((s) => ({ item: s as T, similarity: s.similarity })))
        }

        if (type === "opportunities" || type === "all") {
            const opportunities = await db.$queryRawUnsafe<Array<T & { similarity: number }>>(
                `SELECT *, 1 - (embedding <=> $1::vector) as similarity 
         FROM opportunities 
         WHERE embedding IS NOT NULL 
         ORDER BY similarity DESC 
         LIMIT $2`,
                embeddingArray,
                limit
            )
            results.push(...opportunities.map((o) => ({ item: o as T, similarity: o.similarity })))
        }

        if (type === "projects" || type === "all") {
            const projects = await db.$queryRawUnsafe<Array<T & { similarity: number }>>(
                `SELECT *, 1 - (embedding <=> $1::vector) as similarity 
         FROM projects 
         WHERE embedding IS NOT NULL 
         ORDER BY similarity DESC 
         LIMIT $2`,
                embeddingArray,
                limit
            )
            results.push(...projects.map((p) => ({ item: p as T, similarity: p.similarity })))
        }

        // Sort by similarity and limit
        results.sort((a, b) => b.similarity - a.similarity)
        return results.slice(0, limit)
    } catch (error: any) {
        console.error("[Semantic Search] Error:", error)
        throw new Error(`Semantic search failed: ${error.message}`)
    }
}

/**
 * Blend semantic search results with recency/popularity
 */
export function blendSearchResults<T>(
    semanticResults: SearchResult<T>[],
    weight: { semantic: number; recency: number; popularity: number } = {
        semantic: 0.7,
        recency: 0.2,
        popularity: 0.1,
    }
): T[] {
    // For MVP, just return semantic results sorted by similarity
    // Can be enhanced later with recency/popularity scoring
    return semanticResults.map((r) => r.item)
}

