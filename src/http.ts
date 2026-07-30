const MAX_RETRIES = Number(process.env.MAX_RETRIES ?? 3);

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetch() with exponential backoff on network errors and 5xx / 429 responses.
 * 4xx (other than 429) are returned as-is — retrying a bad request won't help.
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  retries = MAX_RETRIES,
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status >= 500 || res.status === 429) {
        if (attempt < retries) {
          await sleep(2 ** attempt * 1000);
          continue;
        }
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(2 ** attempt * 1000);
        continue;
      }
    }
  }
  throw lastErr ?? new Error(`fetch failed after ${retries} retries: ${url}`);
}
