// Restaurant type definitions

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

export interface SearchFilters {
  query: string;
  cuisine?: string;
  priceLevel?: number;
  neighborhood?: string;
}
