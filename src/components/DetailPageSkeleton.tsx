export default function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Back Navigation Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Hero Image Skeleton */}
      <section className="bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-700 shimmer" />
          
          {/* Thumbnails Skeleton */}
          <div className="flex gap-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Restaurant Info Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              {/* Name */}
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </section>

            {/* Location Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </section>

            {/* Hours Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                <div className="h-5 w-full bg-orange-200 dark:bg-orange-800/30 rounded" />
              </div>
            </section>

            {/* Actions Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="h-12 w-full bg-orange-200 dark:bg-orange-800/30 rounded-xl mb-3" />
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
