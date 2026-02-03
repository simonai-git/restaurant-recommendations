/**
 * Google Places API Integration
 * Handles text search, place details, and photo fetching
 */

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

// Bay Area bounding box for location bias
const BAY_AREA_LOCATION = {
  lat: 37.7749,
  lng: -122.4194,
  radius: 50000 // 50km radius
};

export interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  priceLevel?: number;
  totalRatings?: number;
  openNow?: boolean;
  photos?: PlacePhoto[];
  types?: string[];
}

export interface PlacePhoto {
  photoReference: string;
  height: number;
  width: number;
}

export interface PlaceDetails extends PlaceSearchResult {
  phone?: string;
  website?: string;
  hours?: {
    weekdayText: string[];
    openNow: boolean;
  };
  reviews?: PlaceReview[];
}

export interface PlaceReview {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  relativeTimeDescription: string;
}

/**
 * Search for restaurants using Google Places Text Search API
 */
export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'DEMO_KEY_REPLACE_ME') {
    console.warn('Google Places API key not configured, returning empty results');
    return [];
  }

  const url = new URL(`${PLACES_API_BASE}/textsearch/json`);
  url.searchParams.set('query', `${query} restaurant`);
  url.searchParams.set('location', `${BAY_AREA_LOCATION.lat},${BAY_AREA_LOCATION.lng}`);
  url.searchParams.set('radius', BAY_AREA_LOCATION.radius.toString());
  url.searchParams.set('type', 'restaurant');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      throw new Error(`Google Places API: ${data.status}`);
    }

    return (data.results || []).map(mapPlaceResult);
  } catch (error) {
    console.error('Failed to search places:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'DEMO_KEY_REPLACE_ME') {
    console.warn('Google Places API key not configured');
    return null;
  }

  const url = new URL(`${PLACES_API_BASE}/details/json`);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', [
    'place_id',
    'name',
    'formatted_address',
    'geometry',
    'rating',
    'user_ratings_total',
    'price_level',
    'opening_hours',
    'photos',
    'formatted_phone_number',
    'website',
    'reviews',
    'types'
  ].join(','));
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      if (data.status === 'NOT_FOUND') {
        return null;
      }
      console.error('Google Places API error:', data.status, data.error_message);
      throw new Error(`Google Places API: ${data.status}`);
    }

    return mapPlaceDetails(data.result);
  } catch (error) {
    console.error('Failed to get place details:', error);
    throw error;
  }
}

/**
 * Fetch a photo from Google Places
 */
export async function fetchPlacePhoto(
  photoReference: string,
  maxWidth: number = 400
): Promise<{ data: Buffer; contentType: string } | null> {
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'DEMO_KEY_REPLACE_ME') {
    console.warn('Google Places API key not configured');
    return null;
  }

  const url = new URL(`${PLACES_API_BASE}/photo`);
  url.searchParams.set('photoreference', photoReference);
  url.searchParams.set('maxwidth', maxWidth.toString());
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Places Photo API error: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return { data: buffer, contentType };
  } catch (error) {
    console.error('Failed to fetch place photo:', error);
    throw error;
  }
}

// Helper function to map Google Places result to our format
function mapPlaceResult(place: any): PlaceSearchResult {
  return {
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address || place.vicinity || '',
    lat: place.geometry?.location?.lat || 0,
    lng: place.geometry?.location?.lng || 0,
    rating: place.rating,
    priceLevel: place.price_level,
    totalRatings: place.user_ratings_total,
    openNow: place.opening_hours?.open_now,
    photos: (place.photos || []).slice(0, 3).map((p: any) => ({
      photoReference: p.photo_reference,
      height: p.height,
      width: p.width
    })),
    types: place.types
  };
}

// Helper function to map detailed place info
function mapPlaceDetails(place: any): PlaceDetails {
  return {
    ...mapPlaceResult(place),
    phone: place.formatted_phone_number,
    website: place.website,
    hours: place.opening_hours ? {
      weekdayText: place.opening_hours.weekday_text || [],
      openNow: place.opening_hours.open_now || false
    } : undefined,
    reviews: (place.reviews || []).slice(0, 5).map((r: any) => ({
      authorName: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      relativeTimeDescription: r.relative_time_description
    }))
  };
}

/**
 * Extract cuisine type from place types
 */
export function extractCuisineType(types?: string[]): string | null {
  if (!types) return null;
  
  const cuisineTypes = [
    'japanese_restaurant', 'chinese_restaurant', 'italian_restaurant',
    'mexican_restaurant', 'indian_restaurant', 'thai_restaurant',
    'vietnamese_restaurant', 'korean_restaurant', 'french_restaurant',
    'american_restaurant', 'mediterranean_restaurant', 'middle_eastern_restaurant',
    'seafood_restaurant', 'steakhouse', 'pizza_restaurant', 'sushi_restaurant',
    'bakery', 'cafe', 'bar'
  ];
  
  for (const type of types) {
    if (cuisineTypes.includes(type)) {
      return type.replace('_restaurant', '').replace('_', ' ');
    }
  }
  
  return null;
}
