import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces, extractCuisineType } from '@/lib/google-places';
import { getCachedSearch, cacheSearchResults } from '@/lib/cache';

/**
 * GET /api/search?q=sushi+san+francisco
 * 
 * Search for restaurants using Google Places API with caching
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required parameter: q' },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedResults = await getCachedSearch(query);
    if (cachedResults) {
      return NextResponse.json({
        restaurants: cachedResults.map(r => ({
          ...r,
          cuisineType: extractCuisineType(r.types)
        })),
        source: 'cache',
        query
      });
    }

    // Fetch from Google Places API
    const results = await searchPlaces(query);

    // Cache the results
    if (results.length > 0) {
      await cacheSearchResults(query, results);
    }

    return NextResponse.json({
      restaurants: results.map(r => ({
        ...r,
        cuisineType: extractCuisineType(r.types)
      })),
      source: 'google',
      query
    });
  } catch (error) {
    console.error('Search error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('OVER_QUERY_LIMIT')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search restaurants' },
      { status: 500 }
    );
  }
}
