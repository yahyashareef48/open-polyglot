import Link from "next/link";
import { getLanguageMetadata } from "@/lib/content";

export default async function GermanHome() {
  const languageMeta = await getLanguageMetadata("german");

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
              Welcome to{" "}
              <span className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 dark:from-red-500 dark:via-red-600 dark:to-amber-500 bg-clip-text text-transparent">
                {languageMeta.name}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">{languageMeta.description}</p>

            {/* Available levels */}
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white px-4">Choose Your Level</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {languageMeta.availableLevels.map((level) =>
                  level.enabled ? (
                    <Link key={level.id} href={`/${level.id}`} className="group block transform hover:scale-105 transition-transform duration-300">
                      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
                        {/* Decorative gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/[0.02] dark:from-amber-400/0 dark:via-amber-400/0 dark:to-amber-400/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-red-600 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                        <div className="relative">
                          {/* Header */}
                          <div className="mb-6">
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300 text-left">
                                {level.name}
                              </h3>
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></div>
                                Available Now
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-left">
                            Start your German learning journey at the beginner level
                          </p>

                          {/* Bottom section */}
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Click to start</span>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-black opacity-40"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-40"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600"></div>

                      <div className="relative opacity-50">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-3xl font-bold text-gray-500 dark:text-gray-400 mb-1">{level.name}</h3>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 text-sm font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Coming Soon
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 dark:text-gray-500 leading-relaxed mb-6 text-left">Stay tuned for updates on this level</p>

                        {/* Bottom section */}
                        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 dark:text-gray-500">Not available yet</span>
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 opacity-40"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 opacity-40"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 opacity-40"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
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
