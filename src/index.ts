import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readContacts, writeResultsCsv } from './csv.js';
import { generatePermutations } from './permutations.js';
import { guessEmail } from './guess.js';
import { MillionVerifier } from './providers/millionverifier.js';
import { Prospeo } from './providers/prospeo.js';
import { Blitz } from './providers/blitz.js';
import type { GuessOutcome, Verifier } from './types.js';

const DATA_DIR = resolve(process.cwd(), 'data');
const CONTACTS_CSV = resolve(DATA_DIR, 'contacts.csv');
const RESULTS_CSV = resolve(DATA_DIR, 'results.csv');
const RESULTS_JSON = resolve(DATA_DIR, 'results.json');
const CACHE_JSON = resolve(DATA_DIR, 'cache.json');

const DRY_RUN = process.argv.includes('--dry-run');

function loadCache(): Record<string, GuessOutcome> {
  if (!existsSync(CACHE_JSON)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_JSON, 'utf8')) as Record<string, GuessOutcome>;
  } catch {
    return {};
  }
}

function contactKey(company: string, first: string, last: string, domain: string): string {
  return `${company}|${first}|${last}|${domain}`.toLowerCase();
}

async function main(): Promise<void> {
  if (!existsSync(CONTACTS_CSV)) {
    console.error(`No contacts file at ${CONTACTS_CSV}`);
    console.error(`Run:  npm run generate-contacts   (creates the starter CSV)`);
    process.exit(1);
  }

  const contacts = readContacts(CONTACTS_CSV);
  console.log(`Loaded ${contacts.length} contact(s) from ${CONTACTS_CSV}\n`);

  // ----- Dry run: just show the permutations, spend zero credits. -----
  if (DRY_RUN) {
    for (const c of contacts) {
      console.log(`${c.first_name} ${c.last_name} @ ${c.company} (${c.domain})`);
      generatePermutations(c).forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
      console.log('');
    }
    console.log('Dry run — no verification calls were made.');
    return;
  }

  // ----- Build the provider chain in priority order, skipping unconfigured ones. -----
  const allVerifiers: Verifier[] = [new MillionVerifier(), new Prospeo(), new Blitz()];
  const verifiers = allVerifiers.filter((v) => v.isConfigured());

  if (verifiers.length === 0) {
    console.error('No verification providers are configured. Set API keys in .env');
    console.error('(or run with --dry-run to preview permutations without any API calls).');
    process.exit(1);
  }
  console.log(`Provider chain: ${verifiers.map((v) => v.name).join(' -> ')}`);
  allVerifiers
    .filter((v) => !v.isConfigured())
    .forEach((v) => console.log(`  (skipping ${v.name}: no credentials in .env)`));
  console.log('');

  const cache = loadCache();
  const outcomes: GuessOutcome[] = [];

  for (const c of contacts) {
    const key = contactKey(c.company, c.first_name, c.last_name, c.domain);
    if (cache[key]?.found) {
      const cached = cache[key];
      console.log(`✓ ${c.first_name} ${c.last_name}: ${cached.email} [cached]`);
      outcomes.push(cached);
      continue;
    }

    const outcome = await guessEmail(c, verifiers);
    outcomes.push(outcome);
    cache[key] = outcome;
    writeFileSync(CACHE_JSON, JSON.stringify(cache, null, 2), 'utf8'); // persist as we go

    if (outcome.found) {
      console.log(
        `✓ ${c.first_name} ${c.last_name}: ${outcome.email} ` +
          `[${outcome.provider}, ${outcome.attempts} check(s)]`,
      );
    } else {
      console.log(
        `✗ ${c.first_name} ${c.last_name}: no valid email found ` +
          `(${outcome.attempts} check(s) across ${verifiers.length} provider(s))`,
      );
    }
  }

  writeResultsCsv(RESULTS_CSV, outcomes);
  writeFileSync(RESULTS_JSON, JSON.stringify(outcomes, null, 2), 'utf8');

  const found = outcomes.filter((o) => o.found).length;
  console.log(`\nDone. ${found}/${outcomes.length} emails found.`);
  console.log(`  CSV:  ${RESULTS_CSV}`);
  console.log(`  JSON: ${RESULTS_JSON} (full per-candidate audit log)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
