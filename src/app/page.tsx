'use client';

import { useState, useCallback } from 'react';
import HeroSection from '@/components/HeroSection';
import ResultsGrid from '@/components/ResultsGrid';
import { mockRestaurants } from '@/lib/mock-data';
import { Restaurant } from '@/types/restaurant';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!query.trim()) {
      // Show all restaurants if empty query
      setRestaurants(mockRestaurants);
    } else {
      // Filter mock data based on query (searches name, cuisine, neighborhood)
      const lowercaseQuery = query.toLowerCase();
      const filtered = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        restaurant.cuisine.toLowerCase().includes(lowercaseQuery) ||
        restaurant.neighborhood.toLowerCase().includes(lowercaseQuery)
      );
      setRestaurants(filtered);
    }

    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Search */}
      <HeroSection onSearch={handleSearch} isLoading={isLoading} />

      {/* Results Section */}
      <main className="pb-16">
        <ResultsGrid 
          restaurants={restaurants} 
          isLoading={isLoading}
          searchQuery={hasSearched ? searchQuery : undefined}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Bay Area Eats
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Bay Area Eats. Find your next favorite restaurant.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
