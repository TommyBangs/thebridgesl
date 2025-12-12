/**
 * Revoke Credential Endpoint
 * Marks a credential as revoked on the blockchain
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requireIssuerRole } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Require INSTITUTION role
        await requireIssuerRole(request)

        const { id } = await params

        // Fetch credential
        const credential = await db.credential.findUnique({
            where: { id },
        })

        if (!credential) {
            return NextResponse.json({ error: "Credential not found" }, { status: 404 })
        }

        // Update status to revoked
        const updated = await db.credential.update({
            where: { id },
            data: {
                ...({ blockchainStatus: "revoked" } as any),
            },
        })

        // TODO: Optionally anchor a revocation transaction on Solana
        // For MVP, just updating DB status is sufficient

        return NextResponse.json({
            success: true,
            message: "Credential revoked successfully",
            credential: {
                id: updated.id,
                status: (updated as any).blockchainStatus,
            },
        })
    } catch (error: any) {
        if (error.status === 401 || error.status === 403) {
            return NextResponse.json({ error: error.message }, { status: error.status })
        }

        console.error("[Revoke Credential] Error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

