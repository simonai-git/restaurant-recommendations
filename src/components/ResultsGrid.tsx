import { Restaurant } from '@/types/restaurant';
import RestaurantCard from './RestaurantCard';
import { LoadingGrid } from './RestaurantCardSkeleton';
import EmptyState from './EmptyState';

interface ResultsGridProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  searchQuery?: string;
}

export default function ResultsGrid({ restaurants, isLoading = false, searchQuery }: ResultsGridProps) {
  if (isLoading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        </div>
        <LoadingGrid count={6} />
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <EmptyState query={searchQuery} />
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {searchQuery ? (
            <>Results for &quot;{searchQuery}&quot;</>
          ) : (
            'Popular Restaurants'
          )}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Results Grid - Mobile first responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
