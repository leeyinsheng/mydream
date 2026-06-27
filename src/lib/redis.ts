interface CacheEntry<T> {
  data: T;
  expireAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function getCached<T>(key: string): Promise<T | null> {
  const entry = memoryCache.get(key);
  if (entry && Date.now() < entry.expireAt) {
    return entry.data as T;
  }
  memoryCache.delete(key);
  return null;
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlMs = 300000
): Promise<void> {
  memoryCache.set(key, { data, expireAt: Date.now() + ttlMs });
}
