/**
 * Retry Anchor Endpoint
 * Admin endpoint to retry anchoring a credential on blockchain
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"
import { hashCredential } from "@/lib/blockchain/hash"
import { anchorHash } from "@/lib/blockchain/solana"
import { getSolanaConfig } from "@/lib/blockchain/config"

export const runtime = "nodejs"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)

        // Check if user is admin or institution (for now, allow institution role)
        // TODO: Add proper admin role check
        if (session.user.role !== "INSTITUTION") {
            return NextResponse.json(
                { error: "Only institutions can retry anchoring" },
                { status: 403 }
            )
        }

        const { id } = await params

        // Fetch credential
        const credential = await db.credential.findUnique({
            where: { id },
            include: {
                credentialSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        })

        if (!credential) {
            return NextResponse.json({ error: "Credential not found" }, { status: 404 })
        }

        // Recompute hash
        const hash = hashCredential({
            id: credential.id,
            userId: credential.userId,
            issuer: credential.issuer,
            title: credential.title,
            type: credential.type,
            issueDate: credential.issueDate,
            expiryDate: credential.expiryDate,
            skills: credential.credentialSkills.map((cs) => cs.skill.id),
            createdAt: credential.createdAt,
        })

        // Attempt to anchor
        try {
            const { signature, explorerUrl } = await anchorHash(hash)
            const config = getSolanaConfig()

            // Update credential
            await db.credential.update({
                where: { id },
                data: {
                    blockchainHash: hash,
                    ...({
                        blockchainTxId: signature,
                        blockchainStatus: "anchored",
                        blockchainChain: `solana-${config.cluster}`,
                    } as any),
                },
            })

            return NextResponse.json({
                success: true,
                message: "Credential anchored successfully",
                data: {
                    hash,
                    txId: signature,
                    explorerUrl,
                    chain: `solana-${config.cluster}`,
                },
            })
        } catch (anchorError: any) {
            // Update status to failed
            await db.credential.update({
                where: { id },
                data: {
                    blockchainHash: hash,
                    ...({ blockchainStatus: "failed" } as any),
                },
            })

            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to anchor credential",
                    message: anchorError.message,
                },
                { status: 500 }
            )
        }
    } catch (error: any) {
        if (error.status === 401 || error.status === 403) {
            return NextResponse.json({ error: error.message }, { status: error.status })
        }

        console.error("[Retry Anchor] Error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

