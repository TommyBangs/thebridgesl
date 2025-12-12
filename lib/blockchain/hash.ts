/**
 * Credential Hashing Service
 * Creates deterministic SHA-256 hashes of credentials
 */

import crypto from "crypto"

export interface CredentialData {
    id: string
    userId: string
    issuer: string
    title: string
    type: string
    issueDate: Date | string
    expiryDate?: Date | string | null
    skills: string[] // Skill IDs or names
    createdAt?: Date | string
    updatedAt?: Date | string
}

/**
 * Build canonical payload from credential data
 * Ensures consistent hashing regardless of field order
 */
export function buildCredentialPayload(credential: CredentialData): Record<string, any> {
    // Sort skills array for consistency
    const sortedSkills = [...(credential.skills || [])].sort()

    // Build canonical object with sorted keys
    const payload: Record<string, any> = {
        id: credential.id,
        userId: credential.userId,
        issuer: credential.issuer,
        title: credential.title,
        type: credential.type,
        issueDate: typeof credential.issueDate === "string"
            ? credential.issueDate
            : credential.issueDate.toISOString().split("T")[0], // Date only, no time
        skills: sortedSkills,
    }

    // Add optional fields only if they exist
    if (credential.expiryDate) {
        payload.expiryDate = typeof credential.expiryDate === "string"
            ? credential.expiryDate
            : credential.expiryDate.toISOString().split("T")[0]
    }

    // Include timestamps for additional verification (optional)
    if (credential.createdAt) {
        payload.createdAt = typeof credential.createdAt === "string"
            ? credential.createdAt
            : credential.createdAt.toISOString()
    }

    if (credential.updatedAt) {
        payload.updatedAt = typeof credential.updatedAt === "string"
            ? credential.updatedAt
            : credential.updatedAt.toISOString()
    }

    return payload
}

/**
 * Hash credential data using SHA-256
 * Returns hex string (64 characters)
 */
export function hashCredential(credential: CredentialData): string {
    const payload = buildCredentialPayload(credential)

    // Create canonical JSON string (sorted keys)
    const canonicalJson = JSON.stringify(payload, Object.keys(payload).sort())

    // Hash using SHA-256
    const hash = crypto.createHash("sha256").update(canonicalJson).digest("hex")

    return hash
}

/**
 * Verify credential hash matches expected hash
 */
export function verifyCredentialHash(
    credential: CredentialData,
    expectedHash: string
): boolean {
    const computedHash = hashCredential(credential)
    return computedHash === expectedHash
}

