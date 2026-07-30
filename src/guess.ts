import { generatePermutations } from './permutations.js';
import { sleep } from './http.js';
import type { Contact, GuessOutcome, VerifyResult, Verifier } from './types.js';

const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS ?? 350);

/**
 * Find the best email for a single contact.
 *
 * Strategy (exactly as requested):
 *   1. Build the top-N permutations, ordered most-likely first.
 *   2. Run ALL permutations through provider #1 (MillionVerifier). Accept the
 *      first candidate that comes back "ok".
 *   3. If none are "ok", move to provider #2 (Prospeo) and repeat.
 *   4. If still nothing, move to provider #3 (Blitz).
 *   5. Only "ok" is accepted. catch_all / invalid / unknown are all rejected.
 *
 * @param verifiers ordered list of providers (already filtered to configured ones)
 */
export async function guessEmail(
  contact: Contact,
  verifiers: Verifier[],
  limit = 10,
): Promise<GuessOutcome> {
  const candidates = generatePermutations(contact, limit);
  const log: VerifyResult[] = [];
  let attempts = 0;

  const base: Omit<GuessOutcome, 'found' | 'email' | 'provider' | 'attempts' | 'log'> = {
    company: contact.company,
    first_name: contact.first_name,
    last_name: contact.last_name,
    domain: contact.domain,
  };

  for (const verifier of verifiers) {
    for (const email of candidates) {
      const result = await verifier.verify(email);
      attempts++;
      log.push(result);

      if (result.status === 'ok') {
        return { ...base, found: true, email, provider: verifier.name, attempts, log };
      }
      if (REQUEST_DELAY_MS > 0) await sleep(REQUEST_DELAY_MS);
    }
    // This provider exhausted every candidate without an "ok" -> next provider.
  }

  return { ...base, found: false, email: null, provider: null, attempts, log };
}
