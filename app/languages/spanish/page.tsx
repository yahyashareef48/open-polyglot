export default function SpanishHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Spanish flag accent bar: Red, Yellow, Red */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"></div>

      <section className="relative overflow-hidden">
        {/* Subtle background decoration using flag colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/[0.03] dark:bg-red-500/[0.05] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/[0.03] dark:bg-yellow-300/[0.05] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Flag with subtle glow */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-yellow-400/10 to-red-600/10 dark:from-red-500/20 dark:via-yellow-300/20 dark:to-red-500/20 rounded-full blur-3xl"></div>
                <div className="relative text-7xl md:text-8xl">🇪🇸</div>
              </div>
            </div>

            {/* Title with Spanish flag colors */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenidos to{' '}
              <span className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-700 dark:from-red-500 dark:via-yellow-400 dark:to-red-600 bg-clip-text text-transparent">
                Spanish
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
              ¡Hola! Embark on your Spanish adventure. From Madrid to Mexico City and beyond.
            </p>

            {/* Coming soon card */}
            <div className="max-w-7xl mx-auto">
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg border-l-4 border-red-600 dark:border-yellow-500 overflow-hidden">
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    ¡Próximamente!
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We're preparing an exciting Spanish learning journey for you.
                    Get ready to explore Spanish grammar, vocabulary, and rich Hispanic culture!
                  </p>
                </div>
              </div>
            </div>

            {/* Flag colors decoration */}
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}