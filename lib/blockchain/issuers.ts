/**
 * Issuer Registry
 * Maps Solana wallet addresses to issuer information
 * 
 * This prevents unauthorized entities from anchoring credentials.
 * Only wallets in this registry are considered valid issuers.
 */

export interface IssuerInfo {
    name: string
    logo?: string
    website?: string
    verified: boolean
}

/**
 * Issuer registry mapping wallet addresses to issuer info
 * 
 * TODO: In production, this should be stored in a database
 * and managed through an admin interface.
 */
const ISSUER_REGISTRY: Record<string, IssuerInfo> = {
    // Add your issuer wallets here
    // Example:
    // "YourWalletAddressHere": {
    //   name: "Bridge Platform",
    //   logo: "/logo.png",
    //   website: "https://bridgeplatform.com",
    //   verified: true,
    // },
}

/**
 * Get issuer information by wallet address
 */
export function getIssuerByWallet(walletAddress: string): IssuerInfo | null {
    return ISSUER_REGISTRY[walletAddress] || null
}

/**
 * Check if wallet is a registered issuer
 */
export function isRegisteredIssuer(walletAddress: string): boolean {
    return walletAddress in ISSUER_REGISTRY
}

/**
 * Register a new issuer (admin only - should be protected)
 * 
 * TODO: In production, this should be an admin API endpoint
 * that validates permissions before allowing registration.
 */
export function registerIssuer(
    walletAddress: string,
    issuerInfo: IssuerInfo
): void {
    ISSUER_REGISTRY[walletAddress] = issuerInfo
}

/**
 * Get all registered issuers
 */
export function getAllIssuers(): Record<string, IssuerInfo> {
    return { ...ISSUER_REGISTRY }
}

/**
 * Get issuer wallet address from environment
 * (The wallet that will be used to anchor credentials)
 */
export async function getIssuerWalletAddress(): Promise<string> {
    try {
        const { getIssuerKeypair } = await import("./solana")
        const keypair = getIssuerKeypair()
        return keypair.publicKey.toString()
    } catch (error) {
        console.error("[Issuer Registry] Failed to get wallet address:", error)
        return ""
    }
}

