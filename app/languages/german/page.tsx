import Link from 'next/link';
import { getLanguageMetadata } from '@/lib/content';

export default async function GermanHome() {
  const languageMeta = await getLanguageMetadata('german');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Flag-inspired accent bar */}
      <div className="h-2 bg-gradient-to-r from-black via-red-600 to-yellow-400"></div>

      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">{languageMeta.flagEmoji}</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-red-600">{languageMeta.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {languageMeta.description}
            </p>

            {/* Available levels */}
            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Available Levels
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languageMeta.availableLevels.map((level) => (
                  level.enabled ? (
                    <Link
                      key={level.id}
                      href={`/${level.id}`}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-600">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                          {level.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Start your German learning journey at the beginner level
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                            ✓ Available Now
                          </span>
                          <span className="text-red-600 group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={level.id}
                      className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md opacity-60"
                    >
                      <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                        {level.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500 mb-4">
                        Coming soon! Stay tuned for updates.
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        🔒 Not Yet Available
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* German flag pattern decoration */}
            <div className="mt-12 flex justify-center">
              <div className="flex rounded-lg overflow-hidden shadow-lg">
                <div className="w-8 h-8 bg-black"></div>
                <div className="w-8 h-8 bg-red-600"></div>
                <div className="w-8 h-8 bg-yellow-400"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}