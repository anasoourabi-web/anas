/** A person we want to find an email for. */
export interface Contact {
  company: string;
  first_name: string;
  last_name: string;
  domain: string;
}

/**
 * Normalized verification status across all providers.
 * We only ever *accept* `ok`. Everything else is rejected on purpose:
 *  - catch_all: the domain accepts anything, so a "valid" answer is meaningless
 *  - invalid:   mailbox does not exist
 *  - unknown:   provider could not determine (SMTP greylisting, timeout, etc.)
 *  - error:     the API call itself failed
 */
export type VerifyStatus = 'ok' | 'catch_all' | 'invalid' | 'unknown' | 'error';

export interface VerifyResult {
  email: string;
  status: VerifyStatus;
  provider: string;
  /** Raw provider payload, kept for auditing/debugging. */
  raw?: unknown;
}

/** Every email provider (verifier) implements this. */
export interface Verifier {
  readonly name: string;
  /** True when the required credentials are present, so we can skip it cleanly. */
  isConfigured(): boolean;
  verify(email: string): Promise<VerifyResult>;
}

/** Final outcome for one contact after running the whole chain. */
export interface GuessOutcome {
  company: string;
  first_name: string;
  last_name: string;
  domain: string;
  found: boolean;
  email: string | null;
  /** Which provider confirmed it (e.g. "millionverifier"). */
  provider: string | null;
  /** How many verification API calls we spent on this contact. */
  attempts: number;
  /** Every candidate we tried and what each provider said. */
  log: VerifyResult[];
}
