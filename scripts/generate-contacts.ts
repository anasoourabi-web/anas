import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { writeContacts } from '../src/csv.js';
import { SEED_CONTACTS } from './seed-contacts.js';

const dataDir = resolve(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

const out = resolve(dataDir, 'contacts.csv');
writeContacts(out, SEED_CONTACTS);

console.log(`Wrote ${SEED_CONTACTS.length} contacts -> ${out}`);
console.log('\n⚠️  Review the .lu domains before running verification — they are best guesses.');
console.log('Then run:  npm run guess -- --dry-run   (preview)  or   npm run guess   (verify)');
