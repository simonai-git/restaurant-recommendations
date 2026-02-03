export default function RestaurantCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 sm:h-52 bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Name skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>

        {/* Cuisine badge skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
        </div>
      </div>
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
}

export function LoadingGrid({ count = 6 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  );
}
