/**
 * Caching utilities for Google Places API results
 */

import { prisma } from './prisma';
import type { PlaceSearchResult, PlaceDetails } from './google-places';

// Cache duration in hours
const CACHE_DURATION_HOURS = 24;

/**
 * Get cached search results for a query
 */
export async function getCachedSearch(query: string): Promise<PlaceSearchResult[] | null> {
  const normalizedQuery = query.toLowerCase().trim();
  
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

    return cached.results as unknown as PlaceSearchResult[];
  } catch (error) {
    console.error('Failed to get cached search:', error);
    return null;
  }
}

/**
 * Cache search results
 */
export async function cacheSearchResults(
  query: string,
  results: PlaceSearchResult[]
): Promise<void> {
  const normalizedQuery = query.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000);

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
  } catch (error) {
    console.error('Failed to cache search results:', error);
  }
}

/**
 * Get cached restaurant details by placeId
 */
export async function getCachedRestaurant(placeId: string): Promise<PlaceDetails | null> {
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
    return {
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
  } catch (error) {
    console.error('Failed to get cached restaurant:', error);
    return null;
  }
}

/**
 * Cache restaurant details
 */
export async function cacheRestaurantDetails(details: PlaceDetails): Promise<void> {
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
  } catch (error) {
    console.error('Failed to cache restaurant details:', error);
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
