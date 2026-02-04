/**
 * Redis client setup with graceful fallback
 */

import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isConnected = false;

/**
 * Get Redis client instance (singleton)
 * Returns null if Redis is unavailable
 */
export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.log('Redis: REDIS_URL not configured, skipping Redis cache');
    return null;
  }

  if (redisClient) {
    return isConnected ? redisClient : null;
  }

  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.log('Redis: Max retries reached, giving up');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      connectTimeout: 5000,
    });

    redisClient.on('connect', () => {
      console.log('Redis: Connected');
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      console.error('Redis: Error -', err.message);
      isConnected = false;
    });

    redisClient.on('close', () => {
      console.log('Redis: Connection closed');
      isConnected = false;
    });

    // Try to connect
    redisClient.connect().catch((err) => {
      console.error('Redis: Failed to connect -', err.message);
      isConnected = false;
    });

    return redisClient;
  } catch (error) {
    console.error('Redis: Failed to create client -', error);
    return null;
  }
}

// Cache TTLs in seconds
export const CACHE_TTL = {
  SEARCH: 60 * 60,        // 1 hour for search results
  PLACE: 60 * 60 * 24,    // 24 hours for place details
};

/**
 * Get cached value from Redis
 */
export async function redisGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || !isConnected) return null;

  try {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

/**
 * Set cached value in Redis with TTL
 */
export async function redisSet(key: string, value: unknown, ttlSeconds: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isConnected) return false;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

/**
 * Delete cached value from Redis
 */
export async function redisDel(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isConnected) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
}
