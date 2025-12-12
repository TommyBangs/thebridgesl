/**
 * Public Verification Endpoint
 * Returns credential data with blockchain verification status
 * No authentication required - public endpoint for QR code verification
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyCredentialOnChain } from "@/lib/blockchain/verification"
import { checkRateLimit } from "@/lib/ai/rate-limiter"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Rate limiting (10 requests per minute per IP)
        const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous"
        const rateLimit = checkRateLimit(ip, 10, 60000)
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again later." },
                { status: 429, headers: { "Retry-After": "60" } }
            )
        }

        const credential = await db.credential.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                credentialSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        })

        if (!credential) {
            return NextResponse.json(
                { error: "Credential not found" },
                { status: 404 }
            )
        }

        // Perform blockchain verification (if anchored)
        const cred = credential as any // Type assertion until Prisma is regenerated
        let verification = null
        if (credential.blockchainHash && cred.blockchainTxId) {
            try {
                verification = await verifyCredentialOnChain(id)
            } catch (error) {
                console.error("[Verify] Blockchain verification error:", error)
                // Continue without verification if it fails
            }
        }

        return NextResponse.json({
            credential: {
                id: credential.id,
                title: credential.title,
                issuer: credential.issuer,
                type: credential.type.toLowerCase().replace("_", "-"),
                issueDate: credential.issueDate.toISOString(),
                expiryDate: credential.expiryDate?.toISOString(),
                verified: credential.verified,
                blockchainHash: credential.blockchainHash,
                blockchainTxId: cred.blockchainTxId,
                blockchainStatus: cred.blockchainStatus,
                blockchainChain: cred.blockchainChain,
                qrCode: credential.qrCode,
                user: {
                    id: credential.user.id,
                    name: credential.user.name,
                    email: credential.user.email,
                },
                skills: credential.credentialSkills.map((cs: any) => ({
                    id: cs.skill.id,
                    name: cs.skill.name,
                })),
            },
            verification: verification || {
                verified: false,
                reason: credential.blockchainHash ? "verification_pending" : "not_anchored",
                timestamp: new Date(),
            },
        })
    } catch (error: any) {
        console.error("Credential verification error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

