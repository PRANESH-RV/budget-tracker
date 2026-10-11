# Budgetly AI

Personal budgeting app with an AI coach, chat assistant and natural-language quick-add.
The AI runs through a **server-side proxy**, so the Anthropic API key is never exposed to the browser.

## Architecture

```
Browser (budgetly.html)  ──POST /api/ai──▶  api/ai.js (your server)  ──▶  Anthropic API
  • aggregated numbers only                   • key in env var only
  • renders output with textContent           • origin check, size cap, rate limit
  • AI output never auto-saved                • input sanitised, output validated
```

| Feature | What it does | Model |
|---|---|---|
| AI coach | Plain-language review of the month + 3 specific suggestions | Sonnet |
| Ask Budgetly | Chat about your own numbers | Sonnet |
| Quick add | "Spent 250 on lunch yesterday" → pre-filled form you confirm | Haiku |
| Suggest category | One click inside the transaction form | Haiku |

If the AI server is offline or has no key, quick-add and category suggestion fall back to simple
built-in rules, and the app shows "AI offline · basic mode".

## Run locally

```bash
cp .env.example .env        # then paste your ANTHROPIC_API_KEY
npm run dev                 # Node 20.6+  →  http://localhost:3000
```

## Deploy (Vercel)

1. Push this folder to GitHub and import it in Vercel.
2. Add `ANTHROPIC_API_KEY` under Project Settings → Environment Variables.
3. Deploy. `vercel.json` serves `budgetly.html` at `/` and adds security headers.

## Security measures

- API key only in server environment; never in HTML/JS.
- No CORS headers; same-origin only (extra origins via `ALLOWED_ORIGINS`).
- 16 KB body cap, per-IP rate limit, strict field validation, unknown tasks rejected.
- Prompt-injection hardening: user data is wrapped in `<data>` tags (with `<` escaped) and
  the system prompt tells the model to treat it as untrusted facts.
- Structured outputs (quick-add, category) are re-validated server- and client-side (enum
  categories, numeric amount, date format).
- Upstream errors are logged server-side only; clients get generic messages.
- Privacy: only totals, category sums and top-5 expense categories are sent. Notes are shared
  only if the user ticks the checkbox. Name and password are never sent.
- CSP meta tag + security headers; all stored data is validated on load.

## Login fixes

- Passwords: PBKDF2-SHA256 (150k iterations, random salt) instead of a plain-text PIN.
- Separate Sign in / Create account (typos no longer silently create accounts).
- Password required (8+ chars, common-password check, strength meter, confirmation).
- Brute-force lockout (5 failures → 30 s, doubling up to 15 min); generic error messages.
- Old accounts migrate automatically (PIN is upgraded to a hash; no-PIN accounts are asked to set a password).
- Clear validation messages for invalid names; double-submit protection.
- Logout wipes in-memory state and rendered data; auto sign-out after 15 minutes idle.
- Fixed a timezone bug: dates used UTC, so in India (UTC+5:30) the wrong month/day was
  used between midnight and 5:30 AM.
- CSV export neutralises spreadsheet-formula injection.

## Known limits (be upfront about these in your submission)

- Sign-in is still **client-side**: it separates users on one device but cannot protect data from
  someone with access to the browser's storage. For real accounts and multi-device sync, move auth and
  data to a backend (e.g. Supabase Auth + Postgres with row-level security) and have `/api/ai`
  verify the user's JWT.
- The in-memory rate limiter is per server instance; use Upstash Redis / Vercel KV in production.
- The CSP allows inline scripts (single-file app). Moving JS to a separate file would allow removing `'unsafe-inline'`.
