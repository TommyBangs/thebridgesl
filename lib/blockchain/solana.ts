/**
 * Solana Blockchain Anchoring Service
 * Anchors credential hashes on Solana blockchain using Memo Program
 */

import {
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js"
import bs58 from "bs58"
import { getSolanaConfig } from "./config"
import { checkWalletBalance, ensureMinimumBalance } from "./wallet-monitor"

// Memo Program ID (built-in Solana program)
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

/**
 * Get Solana connection
 */
export function getSolanaConnection(): Connection {
    const config = getSolanaConfig()
    return new Connection(config.rpcUrl, "confirmed")
}

/**
 * Load issuer keypair from environment
 */
export function getIssuerKeypair(): Keypair {
    const config = getSolanaConfig()
    try {
        const secretKey = bs58.decode(config.privateKey)
        return Keypair.fromSecretKey(secretKey)
    } catch (error: any) {
        throw new Error(`Failed to decode SOLANA_PRIVATE_KEY: ${error.message}`)
    }
}


/**
 * Anchor hash on Solana blockchain
 * Returns transaction signature and explorer URL
 */
export async function anchorHash(
    hash: string,
    options?: { retries?: number; timeout?: number }
): Promise<{ signature: string; explorerUrl: string; confirmed: boolean }> {
    const { retries = 3, timeout = 30000 } = options || {}

    // Pre-flight checks
    if (!/^[a-f0-9]{64}$/i.test(hash)) {
        throw new Error("Invalid hash format: must be 64-character hex string")
    }

    const connection = getSolanaConnection()
    const keypair = getIssuerKeypair()

    // Check wallet balance
    await ensureMinimumBalance(0.01) // Minimum 0.01 SOL

    // Create transaction with memo instruction
    const transaction = new Transaction()

    // Add memo instruction (stores the hash)
    const memoData = `CREDENTIAL_HASH:${hash}`
    transaction.add({
        programId: MEMO_PROGRAM_ID,
        keys: [
            {
                pubkey: keypair.publicKey,
                isSigner: true,
                isWritable: false,
            },
        ],
        data: Buffer.from(memoData, "utf-8"),
    })

    // Add minimal transfer to ensure transaction is processed (0.00001 SOL to self)
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: keypair.publicKey,
            lamports: 10000, // 0.00001 SOL
        })
    )

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
    transaction.recentBlockhash = blockhash
    transaction.feePayer = keypair.publicKey

    // Sign and send transaction with retry logic
    let signature: string | undefined
    let lastError: Error | null = null
    let attempt = 0

    while (attempt < retries) {
        try {
            signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                [keypair],
                {
                    commitment: "confirmed",
                    maxRetries: 0, // We handle retries ourselves
                }
            )

            // Verify transaction was confirmed
            const confirmation = await connection.confirmTransaction(
                {
                    signature,
                    blockhash,
                    lastValidBlockHeight,
                },
                "confirmed"
            )

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
            }

            // Build explorer URL
            const config = getSolanaConfig()
            const cluster = config.cluster === "mainnet-beta" ? "" : `?cluster=${config.cluster}`
            const explorerUrl = `https://explorer.solana.com/tx/${signature}${cluster}`

            return {
                signature,
                explorerUrl,
                confirmed: true,
            }
        } catch (error: any) {
            lastError = error
            attempt++

            // Don't retry on certain errors
            if (
                error.message?.includes("insufficient funds") ||
                error.message?.includes("Invalid signature") ||
                error.message?.includes("Transaction failed")
            ) {
                throw error // Fail immediately
            }

            // Retry on network errors
            if (attempt < retries) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Exponential backoff, max 10s
                console.warn(
                    `[Solana Anchor] Attempt ${attempt} failed, retrying in ${delay}ms...`,
                    error.message
                )
                await new Promise((resolve) => setTimeout(resolve, delay))
                continue
            }
        }
    }

    throw lastError || new Error("Failed to anchor hash after retries")
}

/**
 * Estimate cost per anchor operation
 */
export function estimateAnchorCost(): number {
    return 0.00001 // ~0.00001 SOL per transaction (memo + minimal transfer)
}

/**
 * Get transaction from Solana blockchain
 */
export async function getTransaction(signature: string) {
    const connection = getSolanaConnection()
    return await connection.getTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
    })
}

/**
 * Extract hash from transaction memo
 */
export function extractHashFromTransaction(transaction: any): string | null {
    if (!transaction || !transaction.transaction || !transaction.transaction.message) {
        return null
    }

    const instructions = transaction.transaction.message.instructions || []

    // Find memo instruction
    for (const instruction of instructions) {
        if (instruction.programId.toString() === MEMO_PROGRAM_ID.toString()) {
            try {
                const memoData = Buffer.from(instruction.data, "base64").toString("utf-8")
                if (memoData.startsWith("CREDENTIAL_HASH:")) {
                    return memoData.replace("CREDENTIAL_HASH:", "")
                }
            } catch (error) {
                console.error("[Solana] Failed to parse memo:", error)
                return null
            }
        }
    }

    return null
}

