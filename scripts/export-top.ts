import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEED_CONTACTS } from './seed-contacts.js';
import { generatePermutations } from '../src/permutations.js';

const top1: string[] = [];   // single best guess per person
const top3: string[] = [];   // best 3 per person
for (const c of SEED_CONTACTS) {
  const p = generatePermutations(c);
  if (p[0]) top1.push(p[0]);
  for (const e of p.slice(0, 3)) if (e) top3.push(e);
}
mkdirSync(resolve(process.cwd(), 'data'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'data', 'top1-per-person.txt'), top1.join('\n') + '\n');
writeFileSync(resolve(process.cwd(), 'data', 'top3-per-person.txt'), top3.join('\n') + '\n');
console.log(`top1-per-person.txt : ${top1.length} emails`);
console.log(`top3-per-person.txt : ${top3.length} emails\n`);
console.log('--- top1-per-person.txt (paste this) ---');
console.log(top1.join('\n'));
