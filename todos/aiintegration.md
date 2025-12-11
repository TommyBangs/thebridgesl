## AI Integration — Implementation Playbook

Audience: engineers adding practical AI to the Bridge Platform (search, recommendations, assistive content).

### Goals
- Move from mock/static heuristics to data-driven and semantic AI.
- Start with deterministic scoring; add embeddings; layer LLM assists with guardrails.

### Current State (from code)
- Opportunities API: rule-based match score from skill overlap.
- Network suggestions: rule-based skill/mutual-connection scoring.
- Career page: hardcoded recommendations.
- Search: DB text search only (no embeddings).
- No LLM/embedding services configured.

### Target Features (phased)
1) Data-driven recommendations (no LLM): improve scores using real user/profile data.
2) Semantic search: embeddings for users, skills, opportunities, projects.
3) AI assists: constrained LLM helpers for copy/skills suggestions with user confirmation.

### Phase 1: Deterministic Upgrades (fast, low risk)
- Opportunities matching:
  - Add weights for proficiency, recency, location/remote preference, and required vs. nice-to-have skills.
  - Return component scores for transparency.
- Career recommendations:
  - Replace hardcoded list with DB-backed recommendations using demand, openings, salary, and user skill fit.
  - Expose via `/api/career/recommendations`.
- Search ranking:
  - Add simple rank expression (e.g., `ts_rank` if using Postgres full-text) or weighted sorting by recency + match count.

### Phase 2: Semantic Search (embeddings)
- Storage:
  - Add embeddings column per entity (users, skills, opportunities, projects) in Prisma (e.g., `embedding Vector?` if pgvector, or `Float[]`).
  - Add migration to enable pgvector in Postgres (extension) if available.
- Generation:
  - Create `lib/embeddings.ts` using an embedding provider (OpenAI `text-embedding-3-small` or local model). Env: `EMBEDDING_PROVIDER`, `EMBEDDING_API_KEY`.
  - On create/update of entities, enqueue embedding generation (sync for now; job queue later).
- API:
  - Add `/api/search/semantic` with query embedding + ANN search (vector cosine). Fallback to text search if no embedding.
  - Blend results: semantic score + recency + popularity.
- UI:
  - Wire Discover and Network Find to call semantic search when enabled (feature flag `SEMANTIC_SEARCH_ENABLED`).

### Phase 3: AI Assists (LLM with guardrails)
- Use cases:
  - Project description improver and skill/tag suggester.
  - Career guidance “next three actions” given user skills/goals.
- Implementation:
  - Add `/api/ai/project-suggest` and `/api/ai/skills-suggest` that take structured input, call LLM with strict system prompts, and return short, bounded outputs.
  - Enforce max tokens, JSON schema validation, profanity/PII filters; never auto-save—require user confirm.
- UI:
  - In project form, add “Improve description” button; show diff; allow accept/cancel.
  - In career page, add “Suggest next steps” call-to-action.

### Guardrails & Safety
- Keep prompts minimal; set temperature low (≤0.3) for deterministic outputs.
- Validate all model outputs against schema; clamp lengths; strip URLs/emails if not expected.
- Log model inputs/outputs (without secrets) for audit; allow opt-out via settings once settings API exists.

### Infra / Env
- Required envs (examples):
  - `EMBEDDING_PROVIDER`, `EMBEDDING_API_KEY`
  - `OPENAI_API_KEY` (if using OpenAI for LLM/embeddings)
  - `SEMANTIC_SEARCH_ENABLED=true` (feature flag)
- DB: enable pgvector extension; add migrations for embedding columns.

### Testing Plan
- Unit: scoring functions (opportunity match, career ranking); embedding helper; prompt builders.
- Integration: semantic search endpoint returns blended results; AI assist endpoints validate output shape.
- UI: confirm/decline flows for AI suggestions; graceful fallback when embeddings missing.

### Rollout Steps
1) Add pgvector + embedding columns; build `lib/embeddings.ts`.
2) Implement `/api/search/semantic`; add feature flag; wire Discover/Network Find to call it.
3) Improve deterministic scoring for opportunities + career recommendations; expose new endpoints.
4) Add AI assist endpoints and wire project form + career page with confirm-before-save UI.
5) Staging test: generate embeddings, run semantic search, exercise AI assists; add telemetry for usage/errors.

