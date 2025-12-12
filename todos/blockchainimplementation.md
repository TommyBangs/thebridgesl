# Blockchain Verification — Explicit Implementation Guide

**Audience:** Developers implementing verifiable credentials.
**Goal:** Anchor credentials on Solana for tamper-proof verification and provide a trusted verification UI.

---

## 📋 MVP Feature Checklist
1.  **Anchoring:** Hash credential data and store it on Solana.
2.  **Verification:** Scan QR -> Check on-chain hash -> Confirm validity.
3.  **Revocation:** Issuer can revoke a credential (mandatory).
4.  **Issuer Identity:** Show *who* issued the credential (not just a wallet address).

---

## 🛠️ Phase 1: Setup & Data Model

### Step 1.1: Dependencies & Environment
1.  **Install Packages:**
    *   Run `npm install @solana/web3.js bs58`
2.  **Environment Variables:**
    *   `SOLANA_RPC_URL`: Use `https://api.devnet.solana.com` for dev/staging.
    *   `SOLANA_PRIVATE_KEY`: Base58 encoded private key of the issuer wallet.
    *   `SOLANA_CLUSTER`: `devnet` or `mainnet-beta`.
3.  **Wallet Funding:**
    *   Ensure the issuer wallet has SOL.
    *   *Action:* Create a script or cron job to check balance and alert if < 0.1 SOL.

### Step 1.2: Database Schema
1.  **Update `Credential` Model in `prisma/schema.prisma`:**
    *   Add `blockchainHash` (String?): The SHA-256 hash of the credential.
    *   Add `blockchainTxId` (String?): The Solana transaction signature.
    *   Add `blockchainStatus` (String?): Values: `pending`, `anchored`, `failed`, `revoked`.
    *   Add `blockchainChain` (String?): e.g., `solana-devnet`.
2.  **Apply Changes:**
    *   Run `npx prisma generate` and `npx prisma db push`.

---

## 🔐 Phase 2: Hashing & Anchoring

### Step 2.1: Deterministic Hashing
1.  **Create `lib/blockchain/hash.ts`:**
    *   **Goal:** Create a consistent hash regardless of field order.
    *   **Logic:**
        *   Extract specific fields: `id`, `issuer`, `issueDate`, `expiryDate`, `skills` (sort this array!), `userId`.
        *   Create a canonical JSON string (keys sorted alphabetically).
        *   Hash using SHA-256.
        *   Return the hex string.

### Step 2.2: Anchoring Service (Solana)
1.  **Create `lib/blockchain/solana.ts`:**
    *   **Function `anchorHash(hash: string)`:**
        *   Connect to Solana RPC.
        *   Create a transaction.
        *   **Method:** Use the `Memo Program` to attach the hash as a string to a simple 0-value transfer (or micro-lamport transfer) to self. This is the cheapest and standard way to log data.
        *   Sign and send.
        *   Return the `signature` (transaction ID).

### Step 2.3: Integrate with Issuance Flow
1.  **Update Credential Creation API:**
    *   When a credential is created/approved:
        1.  Calculate Hash.
        2.  Call `anchorHash`.
        3.  Update DB with `blockchainHash`, `blockchainTxId`, and `status='anchored'`.
    *   *Error Handling:* If blockchain fails, save the credential anyway but mark status `failed`. Add a "Retry" button in Admin UI.

---

## ✅ Phase 3: Verification & Trust

### Step 3.1: Verification Logic
1.  **Create `app/api/credentials/[id]/blockchain/route.ts`:**
    *   **Inputs:** Credential ID.
    *   **Steps:**
        1.  Fetch Credential from DB.
        2.  Fetch Transaction from Solana using `blockchainTxId`.
        3.  Extract the Memo string from the transaction.
        4.  **Compare:** Does DB Hash == On-Chain Hash?
        5.  **Revocation Check:** Is `blockchainStatus` == `revoked`?
        6.  **Issuer Check:** Does the transaction signer match a known Issuer Wallet?
    *   **Return:** `{ verified: boolean, issuer: { name, logo }, chainData: ... }`

### Step 3.2: Issuer Registry (MVP)
1.  **Simple Implementation:**
    *   Create a constant file `lib/blockchain/issuers.ts`.
    *   Export a map: `Record<WalletAddress, { name: string, logo: string }>`.
    *   *Why:* This prevents anyone from just anchoring a fake hash from their own wallet. The UI will only show "Verified by University X" if the wallet matches.

### Step 3.3: Revocation
1.  **Revoke Endpoint:**
    *   Admin clicks "Revoke".
    *   Update DB `blockchainStatus` = `revoked`.
    *   (Optional for MVP, but good): Anchor a new transaction with "REVOKED:<hash>".
    *   The Verification endpoint must check the DB status first.

---

## 📱 Phase 4: UI Integration

### Step 4.1: Public Verification Page
1.  **Page `/verify/[id]`:**
    *   Call the verification endpoint on load.
    *   **States:**
        *   ✅ **Verified:** Green badge, "Issued by [Institution Name]", link to Solana Explorer.
        *   ❌ **Invalid:** Hash mismatch or revoked. Show warning.
        *   ⏳ **Pending:** Not yet anchored.

### Step 4.2: QR Code
1.  **Generate QR:**
    *   The QR code should point to `https://platform.com/verify/[credential_id]`.
    *   This ensures the verifier lands on *your* trusted domain to see the verification status.

