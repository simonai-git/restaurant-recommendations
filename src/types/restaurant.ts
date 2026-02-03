// Restaurant type definitions

export interface HoursOfOperation {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  photo: string;
  rating: number; // 1-5
  cuisine: string;
  priceLevel: 1 | 2 | 3 | 4; // $, $$, $$$, $$$$
  neighborhood: string;
  address?: string;
  reviewCount?: number;
}

// Extended restaurant details for the detail page
export interface RestaurantDetail extends Restaurant {
  photos: string[];
  fullAddress: string;
  phone: string;
  website: string;
  hours: HoursOfOperation[];
  description: string;
  latitude: number;
  longitude: number;
}

export interface SearchFilters {
  query: string;
  cuisine?: string;
  priceLevel?: number;
  neighborhood?: string;
}
