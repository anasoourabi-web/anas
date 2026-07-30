import { fetchWithRetry } from '../http.js';
import type { VerifyResult, VerifyStatus, Verifier } from '../types.js';

/**
 * Prospeo Email Verifier.
 * Docs: https://prospeo.io/api/email-verifier
 *   POST https://api.prospeo.io/email-verifier
 *   Headers: { "Content-Type": "application/json", "X-KEY": API_KEY }
 *   Body:    { "email": "..." }
 *
 * Response (success): { error: false, response: { email, status, ... } }
 * `status` values seen: DELIVERABLE / VALID | UNDELIVERABLE / INVALID |
 *                       RISKY / CATCH_ALL / ACCEPT_ALL | UNKNOWN
 * We normalize defensively and only accept a clean deliverable.
 */
function mapStatus(status: string | undefined): VerifyStatus {
  const s = (status ?? '').toLowerCase();
  if (s === 'valid' || s === 'deliverable') return 'ok';
  if (s.includes('catch') || s.includes('accept') || s === 'risky') return 'catch_all';
  if (s === 'invalid' || s === 'undeliverable' || s === 'disabled') return 'invalid';
  return 'unknown';
}

interface ProspeoResponse {
  error?: boolean;
  message?: string;
  response?: { email?: string; status?: string; email_status?: string };
}

export class Prospeo implements Verifier {
  readonly name = 'prospeo';
  private readonly apiKey: string;

  constructor(apiKey = process.env.PROSPEO_API_KEY ?? '') {
    this.apiKey = apiKey;
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async verify(email: string): Promise<VerifyResult> {
    try {
      const res = await fetchWithRetry('https://api.prospeo.io/email-verifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-KEY': this.apiKey },
        body: JSON.stringify({ email }),
      });
      const raw = (await res.json()) as ProspeoResponse;
      if (!res.ok || raw.error) {
        return { email, status: 'error', provider: this.name, raw };
      }
      const status = raw.response?.status ?? raw.response?.email_status;
      return { email, status: mapStatus(status), provider: this.name, raw };
    } catch (err) {
      return { email, status: 'error', provider: this.name, raw: String(err) };
    }
  }
}
