import type { Contact } from './types.js';

/**
 * Normalize a name part into an email-safe token:
 *  - strip diacritics (François -> francois, Pütz -> putz, Michaël -> michael)
 *  - lowercase
 *  - drop anything that isn't a-z or 0-9 (hyphens, spaces, apostrophes)
 *
 * "Jean-Marc" -> "jeanmarc", "Doff-Sotta" -> "doffsotta".
 */
export function normalizeToken(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining diacritical marks
    .replace(/ß/g, 'ss')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

/**
 * Generate the top-N most common corporate email patterns for a contact,
 * ordered from most likely to least likely. Deduplicated (single-token
 * names can collapse patterns) while preserving order.
 *
 * Given first="Jean-Marc" last="Kieffer" domain="cdcl.lu":
 *   jean-marc.kieffer -> jeanmarc.kieffer@cdcl.lu, jkieffer@cdcl.lu, ...
 */
export function generatePermutations(contact: Contact, limit = 10): string[] {
  const first = normalizeToken(contact.first_name);
  const last = normalizeToken(contact.last_name);
  const domain = contact.domain.trim().toLowerCase();

  if (!domain) return [];

  const f = first.charAt(0);
  const l = last.charAt(0);

  // Ordered most-common-first for European / .lu corporate mailboxes.
  const localParts: string[] = [];
  if (first && last) {
    localParts.push(
      `${first}.${last}`, // jean.dupont      (most common)
      `${f}${last}`,       // jdupont
      `${first}${last}`,   // jeandupont
      `${first}`,          // jean
      `${first}_${last}`,  // jean_dupont
      `${last}`,           // dupont
      `${last}.${first}`,  // dupont.jean
      `${first}.${l}`,     // jean.d
      `${f}.${last}`,      // j.dupont
      `${last}${f}`,       // dupontj
    );
  } else if (first) {
    localParts.push(first);
  } else if (last) {
    localParts.push(last);
  }

  const seen = new Set<string>();
  const emails: string[] = [];
  for (const lp of localParts) {
    if (!lp) continue;
    const email = `${lp}@${domain}`;
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
    if (emails.length >= limit) break;
  }
  return emails;
}
