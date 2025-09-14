export default function FrenchHome() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Flag-inspired accent bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-white to-red-600"></div>

      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🇫🇷</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenue to <span className="text-blue-600">French</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the beauty of the French language. From Parisian cafés to Quebec winters.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">En Développement</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're crafting a beautiful French learning experience for you.
                Soon you'll master French pronunciation, grammar, and culture!
              </p>
            </div>

            {/* French flag pattern decoration */}
            <div className="mt-12 flex justify-center">
              <div className="flex rounded-lg overflow-hidden shadow-lg">
                <div className="w-8 h-8 bg-blue-600"></div>
                <div className="w-8 h-8 bg-white border border-gray-200"></div>
                <div className="w-8 h-8 bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}