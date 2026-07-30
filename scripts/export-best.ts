import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEED_CONTACTS } from './seed-contacts.js';
import { generatePermutations } from '../src/permutations.js';
import { toCsv } from '../src/csv.js';

const rows: string[][] = [];
for (const c of SEED_CONTACTS) {
  const p = generatePermutations(c);
  rows.push([
    c.company,
    `${c.first_name} ${c.last_name}`,
    c.domain || '(unknown)',
    p[0] ?? '',            // best guess
    p[1] ?? '',            // 2nd alternative
  ]);
}
mkdirSync(resolve(process.cwd(), 'data'), { recursive: true });
const out = resolve(process.cwd(), 'data', 'best-emails.csv');
writeFileSync(out, toCsv(['company', 'name', 'domain', 'best_email', 'alt_email'], rows), 'utf8');
console.log('Wrote ' + out + '\n');
for (const r of rows) console.log((r[1]).padEnd(24), '->', r[3] || '(no domain — unknown)');
