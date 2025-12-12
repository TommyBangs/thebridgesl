# AI Integration — Explicit Implementation Guide

**Audience:** Developers implementing AI features.
**Goal:** Add Resume Parsing, Semantic Search, and Match Explanations to the Bridge Platform.

---

## 📋 MVP Feature Checklist
1.  **Resume Parsing:** Upload PDF -> Auto-fill profile (High Impact).
2.  **Semantic Search:** Find "React dev" when searching "Frontend engineer".
3.  **Match Explanations:** "Why this job?" (Trust).
4.  **Skill Verification:** AI-generated quizzes.

---

## 🛠️ Phase 1: Infrastructure & Setup

### Step 1.1: Dependencies & Environment
1.  **Install Packages:**
    *   Run `npm install openai pgvector`
    *   Run `npm install --save-dev @types/pgvector`
2.  **Environment Variables:**
    *   Add `OPENAI_API_KEY=sk-...` to `.env`.
    *   Add `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`.
    *   Add `OPENAI_LLM_MODEL=gpt-4o-mini`.
    *   Add `SEMANTIC_SEARCH_ENABLED=true`.

### Step 1.2: Database Configuration
1.  **Enable pgvector:**
    *   Connect to your Postgres database and run: `CREATE EXTENSION IF NOT EXISTS vector;`
2.  **Update Prisma Schema (`prisma/schema.prisma`):**
    *   Add `previewFeatures = ["postgresqlExtensions"]` to the `client` generator.
    *   Add `extensions = [vector]` to the `datasource` block.
    *   Add an `embedding` field to `Skill`, `Opportunity`, `Project`, and `User` models.
        *   Type: `Unsupported("vector(1536)")?` (for `text-embedding-3-small`).
3.  **Apply Changes:**
    *   Run `npx prisma generate` and `npx prisma db push`.

### Step 1.3: OpenAI Client Wrapper
1.  **Create `lib/openai.ts`:**
    *   Initialize the OpenAI client using the API key.
    *   Export the client instance and model constants.
    *   *Tip: Fail fast if the API key is missing in development.*

---

## 📄 Phase 2: Resume Parsing (MVP Priority)

### Step 2.1: Parsing Logic
1.  **Create Service `lib/ai/resume-parser.ts`:**
    *   Function `parseResume(text: string)`:
        *   Call `openai.chat.completions.create`.
        *   **System Prompt:** "You are a resume parser. Extract name, bio, skills (list), experience (list), and education. Return JSON only."
        *   **Response Format:** Enforce `{ type: "json_object" }`.
2.  **PDF Text Extraction:**
    *   Use a library like `pdf-parse` (if running on server) or a client-side extractor to get raw text from the uploaded file.

### Step 2.2: API Endpoint
1.  **Create `app/api/ai/parse-resume/route.ts`:**
    *   Accept `POST` with file or text.
    *   Call your parsing service.
    *   Validate the returned JSON structure.
    *   Return the structured data to the frontend.

### Step 2.3: UI Integration
1.  **Onboarding Flow:**
    *   Add an "Upload Resume" step before the manual profile form.
    *   On success, pre-fill the form fields (Bio, Skills, Experience) with the parsed data.
    *   *Crucial:* Allow the user to edit the data before saving. Never auto-save AI output.

---

## 🔍 Phase 3: Semantic Search

### Step 3.1: Embedding Generation Service
1.  **Create `lib/ai/embeddings.ts`:**
    *   Function `generateEmbedding(text: string)`:
        *   Call `openai.embeddings.create` with `text-embedding-3-small`.
        *   Return the vector (`number[]`).
    *   Function `updateEntityEmbedding(id, type, data)`:
        *   Construct a single text string from relevant fields (e.g., for Opportunity: title + description + skills).
        *   Generate embedding.
        *   Update the database row using `db.$executeRaw` (since Prisma doesn't support vector writes natively yet).

### Step 3.2: Search Logic
1.  **Create `lib/ai/search.ts`:**
    *   Function `semanticSearch(query, type)`:
        *   Generate embedding for the `query`.
        *   Perform a cosine similarity search using raw SQL:
            *   `SELECT *, 1 - (embedding <=> $1) as similarity FROM ... ORDER BY similarity DESC`
2.  **Update `app/api/search/route.ts`:**
    *   Check if `SEMANTIC_SEARCH_ENABLED` is true.
    *   If yes, use `semanticSearch`.
    *   If no, fall back to existing Postgres text search.

---

## 🤝 Phase 4: Match Explanations & Verification

### Step 4.1: Match Explanations
1.  **Logic:**
    *   When fetching Opportunities for a user, identify the top match.
    *   Call LLM (`gpt-4o-mini`) with the User's Profile and the Job Description.
    *   **Prompt:** "Explain in one sentence why this job is a good match for this user. Focus on skills and location."
2.  **UI:**
    *   Display this "AI Insight" on the Opportunity card or details page.

### Step 4.2: Skill Verification Quizzes
1.  **Quiz Generator (`app/api/ai/quiz/route.ts`):**
    *   Input: `skillName` (e.g., "React").
    *   LLM Prompt: "Generate 3 multiple-choice questions to test beginner knowledge of React. Return JSON."
2.  **Verification Flow:**
    *   User clicks "Verify" on a skill.
    *   Show modal with generated questions.
    *   If user passes (e.g., 3/3 correct), update `UserSkill` record to `verified = true`.

---

## 🛡️ Guardrails & Safety
*   **Temperature:** Set to `0.0` - `0.3` for all tasks to ensure consistency.
*   **Validation:** Always validate LLM JSON output against a Zod schema before using it.
*   **User Control:** AI suggestions are *drafts*. User must always confirm/edit.

