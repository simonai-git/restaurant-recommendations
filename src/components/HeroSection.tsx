import SearchBar from './SearchBar';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function HeroSection({ onSearch, isLoading }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 
                        dark:from-orange-600 dark:via-orange-700 dark:to-amber-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="food-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="40" cy="40" r="2" fill="currentColor" />
              <circle cx="50" cy="15" r="2.5" fill="currentColor" />
              <circle cx="20" cy="50" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative px-4 py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo / Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 
                          bg-white/20 backdrop-blur-sm rounded-2xl">
            <svg
              className="w-8 h-8 text-white"
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
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 
                         tracking-tight leading-tight">
            Discover Your Next
            <span className="block">Favorite Restaurant</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Find the best dining spots in the Bay Area. From cozy cafés to fine dining, 
            your perfect meal is just a search away.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={onSearch} isLoading={isLoading} />
          </div>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-white/70 text-sm">Popular:</span>
            {['Italian', 'Sushi', 'Mexican', 'Brunch'].map((term) => (
              <button
                key={term}
                onClick={() => onSearch(term)}
                className="text-sm text-white/90 hover:text-white 
                           bg-white/10 hover:bg-white/20 
                           px-3 py-1 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z"
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}
