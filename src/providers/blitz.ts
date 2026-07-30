import { fetchWithRetry } from '../http.js';
import type { VerifyResult, VerifyStatus, Verifier } from '../types.js';

/**
 * Blitz email verifier — LAST fallback in the chain.
 *
 * ⚠️  ADAPTER STUB. The exact request/response shape is filled in from the
 * Blitz API docs (share them and this file gets wired precisely). Everything
 * is driven by env so nothing else in the codebase needs to change:
 *   BLITZ_API_URL  — full verifier endpoint
 *   BLITZ_API_KEY  — auth token
 *
 * Adjust the three TODO spots below to match the real contract:
 *   1. how the request is built (method / headers / query vs body)
 *   2. where the status lives in the JSON response
 *   3. how that status string maps to our normalized VerifyStatus
 */
function mapStatus(status: string | undefined): VerifyStatus {
  const s = (status ?? '').toLowerCase();
  // TODO(#3): confirm these tokens against the Blitz docs.
  if (s === 'valid' || s === 'ok' || s === 'deliverable') return 'ok';
  if (s.includes('catch') || s.includes('accept')) return 'catch_all';
  if (s === 'invalid' || s === 'undeliverable') return 'invalid';
  return 'unknown';
}

export class Blitz implements Verifier {
  readonly name = 'blitz';
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    apiKey = process.env.BLITZ_API_KEY ?? '',
    apiUrl = process.env.BLITZ_API_URL ?? '',
  ) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0 && this.apiUrl.length > 0;
  }

  async verify(email: string): Promise<VerifyResult> {
    try {
      // TODO(#1): match the real Blitz request contract.
      const res = await fetchWithRetry(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ email }),
      });
      const raw = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        return { email, status: 'error', provider: this.name, raw };
      }
      // TODO(#2): read the status from wherever Blitz actually returns it.
      const status =
        (raw.status as string | undefined) ??
        (raw.result as string | undefined) ??
        ((raw.data as Record<string, unknown> | undefined)?.status as string | undefined);
      return { email, status: mapStatus(status), provider: this.name, raw };
    } catch (err) {
      return { email, status: 'error', provider: this.name, raw: String(err) };
    }
  }
}
