## Blockchain Verification & QR — Implementation Plan

Audience: engineers implementing verifiable credentials (hash anchoring + QR) in this codebase.

### Goals
- Give each credential a tamper-evident proof (hash anchored on-chain) and scannable verification (QR/link).
- Keep it cheap, deterministic, and easy to reason about (testnet first, mainnet optional later).

### Current State (what exists)
- `app/api/credentials/[id]/verify/route.ts` returns credential + `blockchainHash` if present.
- `app/api/credentials/[id]/qr/route.ts` generates a QR for `/verify/[id]`.
- UI: `/verify` page and credential detail show QR placeholders and `blockchainHash` when set.
- Prisma: `credential.blockchainHash` exists; no tx/chain metadata; no anchoring logic.

### Target Features (what to build)
1) Anchor credential hash on-chain when issued/verified; persist tx metadata.
2) Verify endpoint that checks the stored hash against the on-chain record and responds with status.
3) UI surfacing: QR that links to verification page; show chain, tx link, and verification result.
4) Admin/issuer flow to (re)anchor or revoke (soft delete / status flip).

### Data Model Changes (Prisma)
- In `prisma/schema.prisma` add to `Credential`:
  - `blockchainHash String?`
  - `blockchainTxId String?`
  - `blockchainChain String?` // e.g., "polygon-mumbai", "sepolia"
  - `blockchainStatus String?` // "anchored", "failed", "pending", "revoked"
- Run `npx prisma generate` + `npx prisma db push`.

### Hash Payload (deterministic)
- Use stable, sorted JSON fields to hash with SHA-256:
  - `id`, `userId`, `issuer`, `title`, `type`, `issueDate`, `expiryDate`, `skills` (sorted), `createdAt`, `updatedAt`.
- Build helper `lib/credential-hash.ts`:
  - `buildCredentialPayload(credential)` -> canonical object with sorted arrays.
  - `hashCredential(payload)` -> `sha256` hex string.

### Anchor Flow (write path)
- Add service `lib/blockchain/anchor.ts`:
  - `anchorHashOnChain(hash, { chain })` returns `{ txId, explorerUrl }`.
  - For MVP, use a thin wrapper that calls a simple anchoring contract (or fallback to a timestamping API if no chain access).
  - Use env: `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_PRIVATE_KEY`, `BLOCKCHAIN_CHAIN`.
- Extend credential create/update (where credential issuance happens) to:
  - Compute hash via helper.
  - Call `anchorHashOnChain`.
  - Store `blockchainHash`, `blockchainTxId`, `blockchainChain`, `blockchainStatus="anchored" | "pending" | "failed"`.
  - If anchoring fails, return 200 with `blockchainStatus="failed"` but do not block issuance; log error.

### Verify Flow (read path)
- Add `app/api/credentials/[id]/blockchain/route.ts`:
  - Fetch credential, ensure it has `blockchainHash`.
  - Query chain (or anchoring service) to retrieve anchored hash for `txId`.
  - Compare stored `blockchainHash` to on-chain hash; return `{ verified: boolean, reason, txId, chain, explorerUrl }`.
- Update `app/api/credentials/[id]/verify/route.ts` to also call the above internally (or return a link) so the UI can show live status.

### QR & Verification Page
- `/verify` page: show QR (already generated) plus:
  - Chain, tx link, last verified timestamp, status badge.
  - If verification fails: show reason and retry button (hits `/blockchain` endpoint).
- Credential detail sidebar: render tx link and status using new fields.

### Revocation / Re-anchor (optional but recommended)
- Add `POST /api/credentials/[id]/reanchor` to recompute hash and re-anchor (e.g., after edits).
- Add `POST /api/credentials/[id]/revoke` to mark `blockchainStatus="revoked"` and optionally anchor a revocation marker (hash of `id` + "revoked").

### Testing Plan
- Unit: hash helper determinism; anchor service mocks; verify comparison logic.
- Integration: create credential -> hash stored -> anchor called (mocked) -> verify returns `verified=true`.
- E2E (staging): issue a credential, anchor on testnet, scan QR, and confirm explorer link and verification match.

### Rollout Steps
1) Add schema fields + generate/push.
2) Implement hash helpers + anchor service (with envs).
3) Wire credential issuance/update to anchor + persist metadata.
4) Add `/blockchain` verify endpoint and surface in `/verify` and credential detail.
5) Staging test with testnet; capture tx link; document envs.
6) Optional: add re-anchor/revoke endpoints and UI buttons for admins.

