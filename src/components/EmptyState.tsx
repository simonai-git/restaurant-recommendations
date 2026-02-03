interface EmptyStateProps {
  query?: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty plate illustration */}
      <div className="relative w-32 h-32 mb-6">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full text-gray-300 dark:text-gray-600"
        >
          {/* Plate */}
          <ellipse
            cx="50"
            cy="55"
            rx="40"
            ry="20"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-700"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="15"
            fill="currentColor"
            className="text-gray-100 dark:text-gray-800"
          />
          <ellipse
            cx="50"
            cy="48"
            rx="25"
            ry="10"
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
          />
          {/* Fork */}
          <path
            d="M25 30 L25 70 M22 30 L22 45 M25 30 L25 45 M28 30 L28 45"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gray-300 dark:text-gray-600"
          />
          {/* Knife */}
          <path
            d="M75 30 L75 70 M75 30 L78 45 L75 45"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gray-300 dark:text-gray-600"
          />
          {/* Question mark */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="20"
            fill="currentColor"
            className="text-gray-400 dark:text-gray-500"
          >
            ?
          </text>
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No restaurants found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        {query ? (
          <>
            We couldn&apos;t find any restaurants matching &quot;<span className="font-medium">{query}</span>&quot;.
            Try a different search term or browse all restaurants.
          </>
        ) : (
          <>
            Start searching to discover amazing restaurants in the Bay Area!
          </>
        )}
      </p>

      {/* Suggestions */}
      {query && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Italian', 'Japanese', 'Mission District', 'Seafood'].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 
                           text-gray-600 dark:text-gray-300 rounded-full text-sm
                           hover:bg-orange-100 dark:hover:bg-orange-900/30 
                           hover:text-orange-600 dark:hover:text-orange-400
                           cursor-pointer transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
