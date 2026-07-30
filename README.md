# Email Permutation Guesser

Guess the most likely corporate email for a contact — **first name + last name +
`.lu` domain** — then verify each guess through a fallback chain of providers,
accepting **only genuinely deliverable (`ok`) mailboxes**. Built for a list of
Luxembourgish construction firms and their leadership, but works for any
first/last/domain data.

## How it works

For every contact:

1. Generate the **top 10 most common corporate email patterns**, ordered
   most-likely first (see below), with Luxembourgish accent handling
   (`François → francois`, `Pütz → putz`, `Jean-Marc → jeanmarc`).
2. Verify each candidate through the provider chain, **in order**:
   1. **MillionVerifier** — run all 10 candidates; accept the first `ok`.
   2. **Prospeo** (Email Verifier) — only if MillionVerifier found nothing.
   3. **Blitz** — only if Prospeo found nothing.
3. **Only `status = ok` is accepted.** `catch_all` / `accept_all`, `invalid`,
   `unknown`, and `disposable` are all rejected — no catch-all or risky
   addresses make it into the results.

The first `ok` wins and we stop immediately, so we spend as few credits as
possible.

### The 10 patterns (most → least common)

| # | Pattern | Example (`Jean Dupont @ acme.lu`) |
|---|---------|-----------------------------------|
| 1 | `first.last`   | jean.dupont@acme.lu |
| 2 | `flast`        | jdupont@acme.lu |
| 3 | `firstlast`    | jeandupont@acme.lu |
| 4 | `first`        | jean@acme.lu |
| 5 | `first_last`   | jean_dupont@acme.lu |
| 6 | `last`         | dupont@acme.lu |
| 7 | `last.first`   | dupont.jean@acme.lu |
| 8 | `first.l`      | jean.d@acme.lu |
| 9 | `f.last`       | j.dupont@acme.lu |
| 10 | `lastf`       | dupontj@acme.lu |

## Quick start

```bash
npm install
cp .env.example .env          # then fill in your API keys

npm run generate-contacts     # writes data/contacts.csv from the seed list
#   ⚠️  REVIEW THE .lu DOMAINS in data/contacts.csv first — they are best guesses.

npm run guess -- --dry-run    # preview the permutations, spends ZERO credits
npm run guess                 # verify for real
```

Outputs:

- `data/results.csv` — one row per contact: found?, email, which provider, #checks.
- `data/results.json` — full per-candidate audit log (every guess + each provider's verdict).
- `data/cache.json` — found emails are cached so re-runs don't re-spend credits.

## Input format

`data/contacts.csv`:

```csv
company,first_name,last_name,domain
CDCL,Max,Didier,cdcl.lu
```

You can edit this file by hand or regenerate it from `scripts/seed-contacts.ts`.

> **Domains are best-guess `.lu` domains** derived from company names. A wrong
> domain guarantees a failed lookup, so verify them before spending credits.

## Configuration (`.env`)

| Variable | Purpose |
|----------|---------|
| `MILLIONVERIFIER_API_KEY` | Primary verifier |
| `PROSPEO_API_KEY` | Fallback #1 (Email Verifier) |
| `BLITZ_API_KEY`, `BLITZ_API_URL` | Fallback #2 |
| `REQUEST_DELAY_MS` | Delay between calls (default 350) |
| `MAX_RETRIES` | Retries on network/5xx errors (default 3) |

Any provider without credentials is **skipped automatically**, so you can run
with just MillionVerifier while the others are still being set up.

## Project layout

```
src/
  permutations.ts            # name normalization + the 10 patterns
  guess.ts                   # the fallback-chain orchestration
  providers/
    millionverifier.ts       # primary
    prospeo.ts               # fallback #1
    blitz.ts                 # fallback #2  (ADAPTER STUB — see below)
  csv.ts  http.ts  types.ts  index.ts
scripts/
  seed-contacts.ts           # the pasted company/leadership list
  generate-contacts.ts       # seed -> data/contacts.csv
```

## ⚠️ Blitz provider is a stub

`src/providers/blitz.ts` is scaffolded but its exact request/response contract
is a placeholder (three clearly-marked `TODO`s). Share the Blitz API docs and
it gets wired precisely — nothing else in the codebase changes.

## Next steps (trigger.dev + Supabase)

The code is structured for this migration:

- **Providers** are self-contained classes implementing a single `Verifier`
  interface — they move to a trigger.dev task unchanged.
- **`guessEmail()`** is a pure async function (contact + verifiers → outcome),
  so a trigger.dev task just calls it per contact.
- **Storage**: swap the `data/*.json` / `data/*.csv` writes in `src/index.ts`
  for Supabase upserts. A `contacts` table (input) and an `email_results`
  table (`company, first_name, last_name, domain, email, provider, status,
  attempts, verified_at`) maps directly onto `GuessOutcome`.

That work is intentionally **not** done yet — per the request, this is the
local script first.
