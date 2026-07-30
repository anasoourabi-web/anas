import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEED_CONTACTS } from './seed-contacts.js';
import { generatePermutations } from '../src/permutations.js';

const all: string[] = [];
const seen = new Set<string>();
for (const c of SEED_CONTACTS) {
  for (const e of generatePermutations(c)) {
    if (!seen.has(e)) { seen.add(e); all.push(e); }
  }
}
mkdirSync(resolve(process.cwd(), 'data'), { recursive: true });
const out = resolve(process.cwd(), 'data', 'all-candidates.txt');
writeFileSync(out, all.join('\n') + '\n', 'utf8');
console.log(`Wrote ${all.length} candidate emails -> ${out}\n`);
console.log(all.join('\n'));
