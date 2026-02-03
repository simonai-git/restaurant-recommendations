import { NextRequest, NextResponse } from 'next/server';
import { fetchPlacePhoto } from '@/lib/google-places';
import { getCachedPhoto, cachePhoto } from '@/lib/cache';

/**
 * GET /api/photos/[photoReference]
 * 
 * Proxy Google Place photos to avoid exposing API key
 * Supports optional maxWidth query parameter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ photoReference: string }> }
) {
  try {
    const { photoReference } = await params;
    const searchParams = request.nextUrl.searchParams;
    const maxWidth = parseInt(searchParams.get('maxWidth') || '400');

    if (!photoReference) {
      return NextResponse.json(
        { error: 'Missing photo reference' },
        { status: 400 }
      );
    }

    // Create cache key that includes maxWidth
    const cacheKey = `${photoReference}_${maxWidth}`;

    // Check cache first
    const cached = await getCachedPhoto(cacheKey);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.data), {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=86400', // 24 hours
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch from Google Places API
    const photo = await fetchPlacePhoto(photoReference, maxWidth);

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found or API key not configured' },
        { status: 404 }
      );
    }

    // Cache the photo
    await cachePhoto(cacheKey, photo.data, photo.contentType);

    return new NextResponse(new Uint8Array(photo.data), {
      status: 200,
      headers: {
        'Content-Type': photo.contentType,
        'Cache-Control': 'public, max-age=86400', // 24 hours
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Fetch photo error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('OVER_QUERY_LIMIT')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}
