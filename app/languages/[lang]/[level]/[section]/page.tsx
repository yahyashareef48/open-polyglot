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

// Define color themes for each language (header only)
const languageThemes: Record<string, {
  gradient: string;
  darkGradient: string;
  accentGradient: string;
}> = {
  german: {
    gradient: 'from-black via-[33%] via-red-600 via-[66%] to-amber-500',
    darkGradient: 'dark:from-gray-900 dark:via-[33%] dark:via-red-900 dark:via-[66%] dark:to-amber-900',
    accentGradient: 'from-black to-amber-500',
  },
  french: {
    gradient: 'from-blue-700 via-white to-red-600',
    darkGradient: 'dark:from-blue-900 dark:via-gray-800 dark:to-red-900',
    accentGradient: 'from-blue-700 to-red-600',
  },
  spanish: {
    gradient: 'from-red-600 via-yellow-400 to-red-600',
    darkGradient: 'dark:from-red-900 dark:via-yellow-700 dark:to-red-900',
    accentGradient: 'from-red-600 to-yellow-400',
  },
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { lang, level, section } = await params;

  try {
    const sectionMeta = await getSectionMetadata(lang, level, section);
    const levelMeta = await getLevelMetadata(lang, level);

    // TODO: Get actual user ID from auth context
    const userId = 'guest';
    const sectionProgress = await getSectionProgress(userId, lang, level, section).catch(() => null);

    const completionPercentage = sectionProgress?.percentComplete ?? 0;

    // Get theme for this language or fallback to default
    const theme = languageThemes[lang] || {
      gradient: 'from-blue-600 via-purple-600 to-indigo-700',
      darkGradient: 'dark:from-blue-900 dark:via-purple-900 dark:to-indigo-950',
      accentGradient: 'from-blue-600 to-purple-600',
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] dark:bg-blue-400/[0.05] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/[0.03] dark:bg-purple-400/[0.05] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Header */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} ${theme.darkGradient}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <Link
              href={`/${level}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to {levelMeta.name}</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {sectionMeta.title}
                </h1>

                <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                  {sectionMeta.description}
                </p>

                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                    <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold text-white">{sectionMeta.lessons.length}</div>
                      <div className="text-xs text-white/70">Lessons</div>
                    </div>
                  </div>

                  {sectionProgress && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-2xl font-bold text-white">{sectionProgress.completedLessons}/{sectionMeta.lessons.length}</div>
                        <div className="text-xs text-white/70">Completed</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Circle */}
              <div className="flex flex-col items-center md:items-end">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                      className="text-emerald-400 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{Math.round(completionPercentage)}%</span>
                    <span className="text-xs text-white/70">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-1 h-8 bg-gradient-to-b ${theme.accentGradient} rounded-full`}></div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lessons
            </h2>
          </div>

          <div className="space-y-4">
            {sectionMeta.lessons.map((lesson, index) => {
              const isCompleted = false; // TODO: Implement per-lesson completion check

              return (
                <Link
                  key={lesson.id}
                  href={`/${level}/${section}/${lesson.id}`}
                  className="block group"
                >
                  <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Animated gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

                    {/* Left accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isCompleted
                        ? 'bg-gradient-to-b from-emerald-500 to-teal-600'
                        : 'bg-gradient-to-b from-blue-600 to-purple-600'
                    } transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`}></div>

                    <div className="relative flex items-start gap-6">
                      {/* Lesson number/status */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white group-hover:scale-110'
                            : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white group-hover:scale-110'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>

                      {/* Lesson content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                              {lesson.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                            <span className="text-sm font-medium">Start</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>

                        {/* Lesson metadata */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{lesson.estimatedMinutes} min</span>
                          </div>

                          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                            {lesson.type}
                          </span>

                          {lesson.hasQuiz && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Quiz
                            </span>
                          )}

                          {lesson.hasExercises && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                              </svg>
                              Exercises
                            </span>
                          )}

                          {isCompleted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium ml-auto">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Completed
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
