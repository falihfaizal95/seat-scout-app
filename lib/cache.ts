// Cache helper using Upstash Redis (or in-memory fallback for dev)
// Install @upstash/redis for production use

const CACHE_TTL = 300; // 5 minutes

// Simple in-memory cache for development
const memCache = new Map<string, { data: unknown; expiresAt: number }>();

async function getRedis() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedis();
    if (redis) {
      const value = await redis.get<T>(key);
      return value;
    }
    // In-memory fallback
    const entry = memCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.data as T;
    }
    return null;
  } catch (err) {
    console.warn("[Cache] get error:", err);
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttl = CACHE_TTL
): Promise<void> {
  try {
    const redis = await getRedis();
    if (redis) {
      await redis.set(key, value, { ex: ttl });
      return;
    }
    // In-memory fallback
    memCache.set(key, { data: value, expiresAt: Date.now() + ttl * 1000 });
  } catch (err) {
    console.warn("[Cache] set error:", err);
  }
}

export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = CACHE_TTL
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached) {
    return cached;
  }
  const fresh = await fetcher();
  await cacheSet(key, fresh, ttl);
  return fresh;
}

export function ticketCacheKey(eventId: string): string {
  return `tickets:v1:${eventId}`;
}

export function searchCacheKey(query: string, sport?: string): string {
  return `search:v1:${query}:${sport || "all"}`.toLowerCase().replace(/\s+/g, "-");
}
