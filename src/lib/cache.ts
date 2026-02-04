/**
 * Caching utilities for Google Places API results
 * Uses Redis as fast cache layer, Postgres as persistent fallback
 */

import { prisma } from './prisma';
import { redisGet, redisSet, CACHE_TTL } from './redis';
import type { PlaceSearchResult, PlaceDetails } from './google-places';

// Cache duration in hours (for Postgres)
const CACHE_DURATION_HOURS = 24;

/**
 * Get cached search results for a query
 * Checks Redis first (fast), then Postgres (persistent)
 */
export async function getCachedSearch(query: string): Promise<{ results: PlaceSearchResult[]; source: 'redis' | 'postgres' } | null> {
  const normalizedQuery = query.toLowerCase().trim();
  const redisKey = `search:${normalizedQuery}`;
  
  // 1. Check Redis first (fast)
  const redisResults = await redisGet<PlaceSearchResult[]>(redisKey);
  if (redisResults) {
    console.log(`Cache hit (Redis): ${redisKey}`);
    return { results: redisResults, source: 'redis' };
  }

  // 2. Check Postgres (slower but persistent)
  try {
    const cached = await prisma.searchCache.findUnique({
      where: { query: normalizedQuery }
    });

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (new Date() > cached.expiresAt) {
      // Delete expired cache
      await prisma.searchCache.delete({
        where: { id: cached.id }
      });
      return null;
    }

    const results = cached.results as unknown as PlaceSearchResult[];
    
    // Backfill Redis for next time
    await redisSet(redisKey, results, CACHE_TTL.SEARCH);
    console.log(`Cache hit (Postgres, backfilled Redis): ${redisKey}`);
    
    return { results, source: 'postgres' };
  } catch (error) {
    console.error('Failed to get cached search:', error);
    return null;
  }
}

/**
 * Cache search results in both Redis (fast) and Postgres (persistent)
 */
export async function cacheSearchResults(
  query: string,
  results: PlaceSearchResult[]
): Promise<void> {
  const normalizedQuery = query.toLowerCase().trim();
  const redisKey = `search:${normalizedQuery}`;
  const expiresAt = new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000);

  // Cache in Redis (fast, 1 hour TTL)
  await redisSet(redisKey, results, CACHE_TTL.SEARCH);
  console.log(`Cached in Redis: ${redisKey}`);

  // Cache in Postgres (persistent, 24 hours)
  try {
    await prisma.searchCache.upsert({
      where: { query: normalizedQuery },
      update: {
        results: results as any,
        expiresAt
      },
      create: {
        query: normalizedQuery,
        results: results as any,
        expiresAt
      }
    });
    console.log(`Cached in Postgres: ${normalizedQuery}`);
  } catch (error) {
    console.error('Failed to cache search results in Postgres:', error);
  }
}

/**
 * Get cached restaurant details by placeId
 * Checks Redis first (fast), then Postgres (persistent)
 */
export async function getCachedRestaurant(placeId: string): Promise<{ details: PlaceDetails; source: 'redis' | 'postgres' } | null> {
  const redisKey = `place:${placeId}`;

  // 1. Check Redis first (fast)
  const redisResult = await redisGet<PlaceDetails>(redisKey);
  if (redisResult) {
    console.log(`Cache hit (Redis): ${redisKey}`);
    return { details: redisResult, source: 'redis' };
  }

  // 2. Check Postgres (slower but persistent)
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { placeId }
    });

    if (!restaurant) {
      return null;
    }

    // Check if cache is stale (older than CACHE_DURATION_HOURS)
    const staleThreshold = new Date(Date.now() - CACHE_DURATION_HOURS * 60 * 60 * 1000);
    if (restaurant.updatedAt < staleThreshold) {
      return null; // Return null to trigger refresh
    }

    // Map database record to PlaceDetails format
    const details: PlaceDetails = {
      placeId: restaurant.placeId,
      name: restaurant.name,
      address: restaurant.address,
      lat: restaurant.lat,
      lng: restaurant.lng,
      rating: restaurant.rating || undefined,
      priceLevel: restaurant.priceLevel || undefined,
      totalRatings: restaurant.totalRatings || undefined,
      openNow: restaurant.openNow || undefined,
      photos: (restaurant.photos as any[]) || [],
      phone: restaurant.phone || undefined,
      website: restaurant.website || undefined,
      hours: restaurant.hours as any || undefined,
      reviews: (restaurant.reviews as any[]) || []
    };

    // Backfill Redis for next time
    await redisSet(redisKey, details, CACHE_TTL.PLACE);
    console.log(`Cache hit (Postgres, backfilled Redis): ${redisKey}`);

    return { details, source: 'postgres' };
  } catch (error) {
    console.error('Failed to get cached restaurant:', error);
    return null;
  }
}

/**
 * Cache restaurant details in both Redis (fast) and Postgres (persistent)
 */
export async function cacheRestaurantDetails(details: PlaceDetails): Promise<void> {
  const redisKey = `place:${details.placeId}`;

  // Cache in Redis (fast, 24 hour TTL)
  await redisSet(redisKey, details, CACHE_TTL.PLACE);
  console.log(`Cached in Redis: ${redisKey}`);

  // Cache in Postgres (persistent)
  try {
    await prisma.restaurant.upsert({
      where: { placeId: details.placeId },
      update: {
        name: details.name,
        address: details.address,
        lat: details.lat,
        lng: details.lng,
        rating: details.rating,
        priceLevel: details.priceLevel,
        phone: details.phone,
        website: details.website,
        hours: details.hours as any,
        photos: details.photos as any || [],
        reviews: details.reviews as any || [],
        openNow: details.openNow,
        totalRatings: details.totalRatings
      },
      create: {
        placeId: details.placeId,
        name: details.name,
        address: details.address,
        lat: details.lat,
        lng: details.lng,
        rating: details.rating,
        priceLevel: details.priceLevel,
        phone: details.phone,
        website: details.website,
        hours: details.hours as any,
        photos: details.photos as any || [],
        reviews: details.reviews as any || [],
        openNow: details.openNow,
        totalRatings: details.totalRatings
      }
    });
    console.log(`Cached in Postgres: ${details.placeId}`);
  } catch (error) {
    console.error('Failed to cache restaurant details in Postgres:', error);
  }
}

/**
 * Get cached photo
 */
export async function getCachedPhoto(
  photoReference: string
): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const cached = await prisma.photoCache.findUnique({
      where: { photoReference }
    });

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (new Date() > cached.expiresAt) {
      await prisma.photoCache.delete({
        where: { id: cached.id }
      });
      return null;
    }

    return {
      data: Buffer.from(cached.imageData),
      contentType: cached.contentType
    };
  } catch (error) {
    console.error('Failed to get cached photo:', error);
    return null;
  }
}

/**
 * Cache photo
 */
export async function cachePhoto(
  photoReference: string,
  data: Buffer,
  contentType: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000);
  // Convert Buffer to Uint8Array for Prisma Bytes field
  const imageData = new Uint8Array(data);

  try {
    await prisma.photoCache.upsert({
      where: { photoReference },
      update: {
        imageData,
        contentType,
        expiresAt
      },
      create: {
        photoReference,
        imageData,
        contentType,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Failed to cache photo:', error);
  }
}

/**
 * Clean up expired cache entries
 */
export async function cleanupExpiredCache(): Promise<void> {
  const now = new Date();

  try {
    await Promise.all([
      prisma.searchCache.deleteMany({
        where: { expiresAt: { lt: now } }
      }),
      prisma.photoCache.deleteMany({
        where: { expiresAt: { lt: now } }
      })
    ]);
  } catch (error) {
    console.error('Failed to cleanup expired cache:', error);
  }
}
