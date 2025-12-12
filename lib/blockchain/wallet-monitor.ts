/**
 * Solana Wallet Monitoring Service
 * Checks wallet balance and provides alerts
 */

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { getSolanaConfig } from "./config"

/**
 * Get Solana connection
 */
export function getSolanaConnection(): Connection {
    const config = getSolanaConfig()
    return new Connection(config.rpcUrl, "confirmed")
}

/**
 * Get wallet public key from private key
 */
export function getWalletPublicKey(): PublicKey {
    const config = getSolanaConfig()
    // We'll decode this in the solana service, but we can get the public key here
    // For now, return a placeholder - actual implementation will be in solana.ts
    throw new Error("Use getIssuerKeypair() from solana.ts to get the public key")
}

/**
 * Check wallet balance in SOL
 */
export async function checkWalletBalance(): Promise<number> {
    try {
        const connection = getSolanaConnection()
        const config = getSolanaConfig()

        // Decode private key to get public key
        const bs58 = await import("bs58")
        const secretKey = bs58.decode(config.privateKey)
        const { Keypair } = await import("@solana/web3.js")
        const keypair = Keypair.fromSecretKey(secretKey)

        const balance = await connection.getBalance(keypair.publicKey)
        return balance / LAMPORTS_PER_SOL
    } catch (error: any) {
        console.error("[Wallet Monitor] Error checking balance:", error.message)
        throw new Error(`Failed to check wallet balance: ${error.message}`)
    }
}

/**
 * Ensure wallet has minimum balance
 * Throws error if balance is below minimum
 */
export async function ensureMinimumBalance(minSol: number = 0.01): Promise<void> {
    const balance = await checkWalletBalance()

    if (balance < minSol) {
        throw new Error(
            `Insufficient SOL balance: ${balance.toFixed(6)} SOL (minimum required: ${minSol} SOL). ` +
            `Please fund your wallet. For devnet, use: https://faucet.solana.com`
        )
    }
}

/**
 * Get wallet status with balance and warnings
 */
export async function getWalletStatus(): Promise<{
    balance: number
    balanceInLamports: number
    status: "healthy" | "low" | "critical"
    message: string
}> {
    const balance = await checkWalletBalance()
    const balanceInLamports = Math.floor(balance * LAMPORTS_PER_SOL)

    let status: "healthy" | "low" | "critical" = "healthy"
    let message = "Wallet balance is sufficient"

    if (balance < 0.01) {
        status = "critical"
        message = "CRITICAL: Wallet balance is below 0.01 SOL. Transactions will fail."
    } else if (balance < 0.1) {
        status = "low"
        message = "WARNING: Wallet balance is below 0.1 SOL. Consider adding more SOL."
    }

    return {
        balance,
        balanceInLamports,
        status,
        message,
    }
}

