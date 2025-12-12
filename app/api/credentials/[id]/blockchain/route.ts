/**
 * Blockchain Verification Endpoint
 * Verifies credential on Solana blockchain
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyCredentialOnChain } from "@/lib/blockchain/verification"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const result = await verifyCredentialOnChain(id)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error("[Blockchain Verification] Error:", error)
        return NextResponse.json(
            {
                verified: false,
                reason: "verification_error",
                timestamp: new Date(),
            },
            { status: 500 }
        )
    }
}

