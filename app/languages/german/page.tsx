import Link from 'next/link';
import { getLanguageMetadata } from '@/lib/content';

export default async function GermanHome() {
  const languageMeta = await getLanguageMetadata('german');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* German flag accent bar: Black, Red, Gold */}
      <div className="h-1 bg-gradient-to-r from-black via-red-600 to-amber-500"></div>

      <section className="relative overflow-hidden">
        {/* Subtle background decoration using flag colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/[0.03] dark:bg-red-500/[0.05] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] dark:bg-amber-400/[0.05] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Flag with subtle glow */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 dark:from-red-500/20 dark:via-amber-400/20 dark:to-red-500/20 rounded-full blur-3xl"></div>
                <div className="relative text-7xl md:text-8xl">{languageMeta.flagEmoji}</div>
              </div>
            </div>

            {/* Title with German flag colors */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 dark:from-red-500 dark:via-red-600 dark:to-amber-500 bg-clip-text text-transparent">
                {languageMeta.name}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
              {languageMeta.description}
            </p>

            {/* Available levels */}
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white px-4">
                  Choose Your Level
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languageMeta.availableLevels.map((level) => (
                  level.enabled ? (
                    <Link
                      key={level.id}
                      href={`/${level.id}`}
                      className="group block"
                    >
                      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-red-600 dark:border-amber-500 overflow-hidden">
                        <div className="relative">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {level.name}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            Start your German learning journey at the beginner level
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                              ✓ Available Now
                            </span>
                            <span className="text-red-600 dark:text-amber-500 group-hover:translate-x-1 transition-transform text-lg">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={level.id}
                      className="relative bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 shadow-md border-l-4 border-gray-300 dark:border-gray-600 opacity-60"
                    >
                      <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">
                        {level.name}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm">
                        Stay tuned for updates on this level
                      </p>

                      <span className="text-sm text-gray-400 font-medium">
                        🔒 Not Yet Available
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Flag colors decoration */}
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}