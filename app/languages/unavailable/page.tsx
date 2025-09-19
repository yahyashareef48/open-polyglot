'use client';

import { Github, ArrowLeft, Languages } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UnavailableContent() {
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get('lang') || 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="text-8xl mb-8">🌍</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Language Not Available
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Sorry, we don't have <span className="font-semibold text-blue-600">{requestedLanguage}</span> available yet.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Languages size={32} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request This Language</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're always looking to add more languages! Help us prioritize by requesting <strong>{requestedLanguage}</strong> or any other language you'd like to learn.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/yahyashareef48/open-polyglot/issues/new?assignees=&labels=language-request&projects=&template=language-request.md&title=Request+for+%5BLanguage+Name%5D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Github size={20} />
                  Request on GitHub
                </a>
                <a
                  href="/"
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 px-6 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back to Home
                </a>
              </div>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400">
              <h3 className="text-lg font-semibold mb-2">Currently Available Languages:</h3>
              <div className="flex justify-center gap-4">
                <span className="flex items-center gap-1">🇩🇪 German</span>
                <span className="flex items-center gap-1">🇫🇷 French (Coming Soon)</span>
                <span className="flex items-center gap-1">🇪🇸 Spanish (Coming Soon)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function UnavailableLanguage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8">🌍</div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    }>
      <UnavailableContent />
    </Suspense>
  );
}