'use client';

import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🔍</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              404 - Page Not Found
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The page you're looking for doesn't exist.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl mb-8">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This could be an invalid subdomain or a broken link. Try visiting our homepage to explore available languages.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Home size={20} />
                  Go to Homepage
                </a>
                <button
                  onClick={() => window.history.back()}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 px-6 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}