/**
 * Solana Blockchain Configuration and Validation
 * Validates Solana environment variables and provides configuration
 */

export interface SolanaConfig {
    rpcUrl: string
    privateKey: string
    cluster: "devnet" | "mainnet-beta"
}

/**
 * Validates Solana configuration from environment variables
 * Throws error with clear message if validation fails
 */
export function validateSolanaConfig(): SolanaConfig {
    const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
    const privateKey = process.env.SOLANA_PRIVATE_KEY
    const cluster = (process.env.SOLANA_CLUSTER || "devnet") as "devnet" | "mainnet-beta"

    if (!privateKey) {
        throw new Error(
            "SOLANA_PRIVATE_KEY is required. Please add it to your .env file. This should be a base58-encoded private key."
        )
    }

    // Validate base58 format (basic check - should start with non-zero characters)
    if (privateKey.length < 32 || privateKey.length > 88) {
        throw new Error(
            "SOLANA_PRIVATE_KEY appears to be invalid. It should be a base58-encoded private key (32-88 characters)."
        )
    }

    // Validate cluster
    if (cluster !== "devnet" && cluster !== "mainnet-beta") {
        throw new Error(
            `SOLANA_CLUSTER must be either "devnet" or "mainnet-beta". Got: ${cluster}`
        )
    }

    // Validate RPC URL format
    if (!rpcUrl.startsWith("http://") && !rpcUrl.startsWith("https://")) {
        throw new Error(
            `SOLANA_RPC_URL must be a valid HTTP/HTTPS URL. Got: ${rpcUrl}`
        )
    }

    return {
        rpcUrl,
        privateKey,
        cluster,
    }
}

/**
 * Get validated Solana configuration
 * Caches the result to avoid re-validation
 */
let cachedConfig: SolanaConfig | null = null

export function getSolanaConfig(): SolanaConfig {
    if (!cachedConfig) {
        cachedConfig = validateSolanaConfig()
    }
    return cachedConfig
}

/**
 * Reset cached config (useful for testing)
 */
export function resetConfigCache() {
    cachedConfig = null
}

