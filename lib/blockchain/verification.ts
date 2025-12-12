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

    // Type assertion for blockchain fields until Prisma is regenerated
    const cred = credential as any

    // Check if credential has blockchain data
    if (!credential.blockchainHash || !cred.blockchainTxId) {
        return {
            verified: false,
            reason: "not_anchored",
            timestamp,
        }
    }

    // Check revocation status (fastest check)
    if (cred.blockchainStatus === "revoked") {
        return {
            verified: false,
            reason: "revoked",
            timestamp,
        }
    }

    try {
        // Fetch transaction from Solana
        const transaction = await getTransaction(cred.blockchainTxId)

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
        // Handle both legacy and versioned transactions
        const accountKeys = transaction.transaction.message.getAccountKeys()
        const staticKeys = accountKeys.staticAccountKeys
        const signerKeys = staticKeys.slice(0, transaction.transaction.message.header.numRequiredSignatures)
        const issuerWallet = signerKeys[0]?.toString() || staticKeys[0]?.toString()
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
        const explorerUrl = `https://explorer.solana.com/tx/${cred.blockchainTxId}${cluster}`

        return {
            verified: true,
            issuer: {
                name: issuer.name,
                logo: issuer.logo,
                website: issuer.website,
            },
            chainData: {
                txId: cred.blockchainTxId,
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
                const transaction = await getTransaction(cred.blockchainTxId)
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

