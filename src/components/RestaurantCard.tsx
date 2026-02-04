import Image from 'next/image';
import Link from 'next/link';
import { Restaurant } from '@/types/restaurant';
import StarRating from './StarRating';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

// Convert price level number to dollar signs
function getPriceDisplay(level: number): string {
  return '$'.repeat(level);
}

export default function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  // Stagger animation delay based on index
  const animationDelay = `${index * 0.05}s`;

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <article 
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md 
                   hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer
                   animate-fade-in opacity-0"
        style={{ 
          animationDelay,
          animationFillMode: 'forwards'
        }}
      >
      {/* Restaurant Photo */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={restaurant.photo}
          alt={`${restaurant.name} restaurant`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Price Badge Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 
                        backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-green-600 dark:text-green-400 font-bold text-sm">
            {getPriceDisplay(restaurant.priceLevel)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Restaurant Name */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 
                       group-hover:text-orange-500 transition-colors line-clamp-1">
          {restaurant.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={restaurant.rating} size="sm" />
          {restaurant.reviewCount && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({restaurant.reviewCount} reviews)
            </span>
          )}
        </div>

        {/* Cuisine Badge */}
        <div className="mb-3">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 
                           text-orange-700 dark:text-orange-300 
                           text-xs font-medium px-2.5 py-1 rounded-full">
            {restaurant.cuisine}
          </span>
        </div>

        {/* Neighborhood / Location */}
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm truncate">{restaurant.neighborhood}</span>
        </div>
      </div>
    </article>
    </Link>
  );
}
