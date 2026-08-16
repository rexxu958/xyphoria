import "server-only";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

const DEFAULT_TTL_MS = 30_000;
const DEFAULT_STALE_MS = 120_000;

export async function cached<T>(
  key: string,
  loader: () => Promise<T>,
  options?: { ttlMs?: number; staleMs?: number }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const staleMs = options?.staleMs ?? DEFAULT_STALE_MS;
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && now < entry.expiresAt) {
    return entry.value;
  }

  if (entry && now < entry.staleAt) {
    if (!inflight.has(key)) {
      const promise = loader()
        .then((value) => {
          store.set(key, { value, expiresAt: Date.now() + ttlMs, staleAt: Date.now() + staleMs });
          inflight.delete(key);
          return value;
        })
        .catch((error) => {
          inflight.delete(key);
          throw error;
        });
      inflight.set(key, promise);
    }
    return entry.value;
  }

  if (inflight.has(key)) {
    return inflight.get(key) as Promise<T>;
  }

  const promise = loader()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs, staleAt: Date.now() + staleMs });
      inflight.delete(key);
      return value;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });
  inflight.set(key, promise);
  return promise;
}

export function invalidate(key: string): void {
  store.delete(key);
  inflight.delete(key);
}

export function invalidateAll(): void {
  store.clear();
  inflight.clear();
}

export const CACHE_KEYS = {
  tools: "db:tools",
  categories: "db:categories",
  settings: "db:settings",
  statistics: "db:statistics",
  activity: "db:activity"
};
