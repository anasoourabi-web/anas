import { fetchWithRetry } from '../http.js';
import type { VerifyResult, VerifyStatus, Verifier } from '../types.js';

/**
 * MillionVerifier single-email API.
 * Docs: https://developer.millionverifier.com/
 *   GET https://api.millionverifier.com/api/v3/?api=KEY&email=EMAIL&timeout=20
 *
 * `result` values: ok | catch_all | unknown | invalid | disposable
 * We map to our normalized status and only accept "ok".
 */
function mapStatus(result: string | undefined): VerifyStatus {
  switch ((result ?? '').toLowerCase()) {
    case 'ok':
      return 'ok';
    case 'catch_all':
      return 'catch_all';
    case 'invalid':
    case 'disposable':
      return 'invalid';
    default:
      return 'unknown';
  }
}

export class MillionVerifier implements Verifier {
  readonly name = 'millionverifier';
  private readonly apiKey: string;

  constructor(apiKey = process.env.MILLIONVERIFIER_API_KEY ?? '') {
    this.apiKey = apiKey;
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async verify(email: string): Promise<VerifyResult> {
    const url =
      `https://api.millionverifier.com/api/v3/?api=${encodeURIComponent(this.apiKey)}` +
      `&email=${encodeURIComponent(email)}&timeout=20`;

    try {
      const res = await fetchWithRetry(url);
      const raw = (await res.json()) as { result?: string; error?: string };
      if (!res.ok || raw.error) {
        return { email, status: 'error', provider: this.name, raw };
      }
      return { email, status: mapStatus(raw.result), provider: this.name, raw };
    } catch (err) {
      return { email, status: 'error', provider: this.name, raw: String(err) };
    }
  }
}
