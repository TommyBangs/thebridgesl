/**
 * Blockchain Verification Service
 * Verifies credentials by checking on-chain hash against stored hash
 */

import { getTransaction, extractHashFromTransaction } from "./solana"
import { hashCredential, type CredentialData } from "./hash"
import { getIssuerByWallet } from "./issuers"
import { db } from "@/lib/db"

export interface VerificationResult {
    verified: boolean
    reason?: string
    issuer?: {
        name: string
        logo?: string
        website?: string
    }
    chainData?: {
        txId: string
        explorerUrl: string
        chain: string
    }
    timestamp: Date
}

/**
 * Verify credential on blockchain
 */
export async function verifyCredentialOnChain(
    credentialId: string
): Promise<VerificationResult> {
    const timestamp = new Date()

    // Fetch credential from database
    const credential = await db.credential.findUnique({
        where: { id: credentialId },
        include: {
            credentialSkills: {
                include: {
                    skill: true,
                },
            },
        },
    })

    if (!credential) {
        return {
            verified: false,
            reason: "credential_not_found",
            timestamp,
        }
    }

    // Check if credential has blockchain data
    if (!credential.blockchainHash || !credential.blockchainTxId) {
        return {
            verified: false,
            reason: "not_anchored",
            timestamp,
        }
    }

    // Check revocation status (fastest check)
    if (credential.blockchainStatus === "revoked") {
        return {
            verified: false,
            reason: "revoked",
            timestamp,
        }
    }

    try {
        // Fetch transaction from Solana
        const transaction = await getTransaction(credential.blockchainTxId)

        if (!transaction) {
            return {
                verified: false,
                reason: "transaction_not_found",
                timestamp,
            }
        }

        // Extract hash from transaction memo
        const onChainHash = extractHashFromTransaction(transaction)

        if (!onChainHash) {
            return {
                verified: false,
                reason: "no_memo_found",
                timestamp,
            }
        }

        // Compare hashes
        if (onChainHash !== credential.blockchainHash) {
            return {
                verified: false,
                reason: "hash_mismatch",
                timestamp,
            }
        }

        // Verify issuer (check transaction signer)
        const signers = transaction.transaction.message.accountKeys
            .filter((key: any) => key.signer)
            .map((key: any) => key.pubkey.toString())

        const issuerWallet = signers[0] // First signer is the payer
        const issuer = getIssuerByWallet(issuerWallet)

        if (!issuer) {
            return {
                verified: false,
                reason: "unknown_issuer",
                timestamp,
            }
        }

        // Build explorer URL
        const config = await import("./config").then((m) => m.getSolanaConfig())
        const cluster = config.cluster === "mainnet-beta" ? "" : `?cluster=${config.cluster}`
        const explorerUrl = `https://explorer.solana.com/tx/${credential.blockchainTxId}${cluster}`

        return {
            verified: true,
            issuer: {
                name: issuer.name,
                logo: issuer.logo,
                website: issuer.website,
            },
            chainData: {
                txId: credential.blockchainTxId,
                explorerUrl,
                chain: `solana-${config.cluster}`,
            },
            timestamp,
        }
    } catch (error: any) {
        console.error("[Verification] Error:", error)

        // Retry once on RPC errors
        if (error.message?.includes("network") || error.message?.includes("timeout")) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                const transaction = await getTransaction(credential.blockchainTxId)
                if (transaction) {
                    // Retry verification logic here if needed
                }
            } catch (retryError) {
                return {
                    verified: false,
                    reason: "rpc_error",
                    timestamp,
                }
            }
        }

        return {
            verified: false,
            reason: "verification_error",
            timestamp,
        }
    }
}

