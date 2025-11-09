import Link from 'next/link';
import { getLevelMetadata, getSectionsForLevel } from '@/lib/content';
import { getCompletionPercentage } from '@/lib/progress';

interface LevelPageProps {
  params: Promise<{
    lang: string;
    level: string;
  }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { lang, level } = await params;

  try {
    const levelMeta = await getLevelMetadata(lang, level);
    const sections = await getSectionsForLevel(lang, level);

    // TODO: Get actual user ID from auth context
    const userId = 'guest';
    const completionPercentage = await getCompletionPercentage(userId, lang, level).catch(() => 0);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/languages/${lang}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-block"
                >
                  ← Back to {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {levelMeta.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  {levelMeta.description}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">
                    {Math.round(completionPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-600 to-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Level info */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {levelMeta.estimatedHours} hours
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Sections:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sections.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Learning objectives */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Objectives
            </h2>
            <ul className="space-y-2">
              {levelMeta.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sections</h2>

            {sections.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No sections available yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/languages/${lang}/${level}/${section.id}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-red-600">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                          {section.title}
                        </h3>
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          {section.lessons.length} lessons
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {section.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ~{section.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)} min
                        </span>
                        <span className="text-red-600 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading level:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Level Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The level you're looking for doesn't exist or is not yet available.
          </p>
          <Link
            href={`/languages/${lang}`}
            className="text-red-600 hover:text-red-700 underline"
          >
            ← Back to Language Overview
          </Link>
        </div>
      </div>
    );
  }
}
