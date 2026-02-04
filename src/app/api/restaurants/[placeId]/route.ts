import { NextRequest, NextResponse } from 'next/server';
import { getPlaceDetails, extractCuisineType } from '@/lib/google-places';
import { getCachedRestaurant, cacheRestaurantDetails } from '@/lib/cache';

/**
 * GET /api/restaurants/[placeId]
 * 
 * Get detailed information about a specific restaurant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const { placeId } = await params;

    if (!placeId) {
      return NextResponse.json(
        { error: 'Missing place ID' },
        { status: 400 }
      );
    }

    // Check cache first (Redis → Postgres)
    const cached = await getCachedRestaurant(placeId);
    if (cached) {
      return NextResponse.json({
        restaurant: {
          ...cached.details,
          cuisineType: extractCuisineType(cached.details.types)
        },
        source: cached.source // 'redis' or 'postgres'
      });
    }

    // Fetch from Google Places API
    const details = await getPlaceDetails(placeId);

    if (!details) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Cache the details
    await cacheRestaurantDetails(details);

    return NextResponse.json({
      restaurant: {
        ...details,
        cuisineType: extractCuisineType(details.types)
      },
      source: 'google'
    });
  } catch (error) {
    console.error('Get restaurant details error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('OVER_QUERY_LIMIT')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get restaurant details' },
      { status: 500 }
    );
  }
}
