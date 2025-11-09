import Link from 'next/link';
import { getSectionMetadata, getLevelMetadata } from '@/lib/content';
import { getSectionProgress } from '@/lib/progress';

interface SectionPageProps {
  params: Promise<{
    lang: string;
    level: string;
    section: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { lang, level, section } = await params;

  try {
    const sectionMeta = await getSectionMetadata(lang, level, section);
    const levelMeta = await getLevelMetadata(lang, level);

    // TODO: Get actual user ID from auth context
    const userId = 'guest';
    const sectionProgress = await getSectionProgress(userId, lang, level, section).catch(() => null);

    const completionPercentage = sectionProgress?.percentComplete ?? 0;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href={`/${level}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-block"
            >
              ← Back to {levelMeta.name}
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {sectionMeta.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  {sectionMeta.description}
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

            {/* Section info */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Total Lessons:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sectionMeta.lessons.length}
                </span>
              </div>
              {sectionProgress && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {sectionProgress.completedLessons} / {sectionProgress.totalLessons}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lessons</h2>

          <div className="space-y-4">
            {sectionMeta.lessons.map((lesson, index) => {
              const isCompleted = sectionProgress?.lessons.find(l => l.lessonId === lesson.id)?.completed ?? false;

              return (
                <Link
                  key={lesson.id}
                  href={`/${level}/${section}/${lesson.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-transparent hover:border-red-600">
                    <div className="flex items-start gap-4">
                      {/* Lesson number */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                      </div>

                      {/* Lesson content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {lesson.description}
                            </p>
                          </div>
                          <span className="text-red-600 group-hover:translate-x-1 transition-transform flex-shrink-0">
                            →
                          </span>
                        </div>

                        {/* Lesson metadata */}
                        <div className="flex flex-wrap gap-3 mt-4 text-sm">
                          <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <span>⏱️</span>
                            {lesson.estimatedMinutes} min
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                            {lesson.type}
                          </span>
                          {lesson.hasQuiz && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-700 dark:text-blue-300">
                              📝 Quiz
                            </span>
                          )}
                          {lesson.hasExercises && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-700 dark:text-purple-300">
                              💪 Exercises
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading section:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Section Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The section you're looking for doesn't exist or is not yet available.
          </p>
          <Link
            href={`/${level}`}
            className="text-red-600 hover:text-red-700 underline"
          >
            ← Back to Level Overview
          </Link>
        </div>
      </div>
    );
  }
}
