import Link from 'next/link';
import { getLessonContent, getNavigationInfo, getSectionMetadata } from '@/lib/content';
import { getLessonProgress } from '@/lib/progress';
import LessonContent from '@/app/components/lessons/LessonContent';
import LessonNavigation from '@/app/components/lessons/LessonNavigation';
import MarkCompleteButton from '@/app/components/lessons/MarkCompleteButton';
import LessonAudioLoader from '@/app/components/lessons/LessonAudioLoader';

interface LessonPageProps {
  params: Promise<{
    lang: string;
    level: string;
    section: string;
    lesson: string;
  }>;
}

// Define color themes for each language (header only)
const languageThemes: Record<string, {
  gradient: string;
  darkGradient: string;
}> = {
  german: {
    gradient: 'from-black via-[33%] via-red-600 via-[66%] to-amber-500',
    darkGradient: 'dark:from-gray-900 dark:via-[33%] dark:via-red-900 dark:via-[66%] dark:to-amber-900',
  },
  french: {
    gradient: 'from-blue-700 via-white to-red-600',
    darkGradient: 'dark:from-blue-900 dark:via-gray-800 dark:to-red-900',
  },
  spanish: {
    gradient: 'from-red-600 via-yellow-400 to-red-600',
    darkGradient: 'dark:from-red-900 dark:via-yellow-700 dark:to-red-900',
  },
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lang, level, section, lesson } = await params;

  try {
    const lessonContent = await getLessonContent(lang, level, section, lesson);
    const navigationInfo = await getNavigationInfo(lang, level, section, lesson);
    const sectionMeta = await getSectionMetadata(lang, level, section);

    // TODO: Get actual user ID from auth context
    const userId = 'guest';
    const lessonProgress = await getLessonProgress(userId, lang, level, section, lesson).catch(() => null);

    const isCompleted = lessonProgress?.completed ?? false;

    // Find lesson info from section metadata
    const lessonInfo = sectionMeta.lessons.find(l => l.id === lesson);

    // Get theme for this language or fallback to default
    const theme = languageThemes[lang] || {
      gradient: 'from-blue-600 via-purple-600 to-indigo-700',
      darkGradient: 'dark:from-blue-900 dark:via-purple-900 dark:to-indigo-950',
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Load lesson content into audio player */}
        <LessonAudioLoader lessonContent={lessonContent} />

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] dark:bg-blue-400/[0.05] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/[0.03] dark:bg-purple-400/[0.05] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Header */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} ${theme.darkGradient}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Link
              href={navigationInfo.parent.url}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to {navigationInfo.parent.title}</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {lessonContent.title}
                </h1>

                {lessonInfo && (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-white/90">{lessonInfo.estimatedMinutes} min</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-white/90">{lessonInfo.type}</span>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-emerald-400/30">
                        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-emerald-200">Completed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lesson content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100 dark:border-gray-700">
            <LessonContent content={lessonContent} />
          </div>

          {/* Mark complete button */}
          {!isCompleted && (
            <div className="mb-8">
              <MarkCompleteButton
                userId={userId}
                languageCode={lang}
                levelId={level}
                sectionId={section}
                lessonId={lesson}
              />
            </div>
          )}

          {/* Navigation */}
          <LessonNavigation navigationInfo={navigationInfo} />

          {/* Additional info */}
          {lessonInfo && (lessonInfo.hasQuiz || lessonInfo.hasExercises) && (
            <div className="mt-8 relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border-l-4 border-blue-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Additional Practice Available
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lessonInfo.hasQuiz && 'Take the quiz to test your knowledge. '}
                  {lessonInfo.hasExercises && 'Complete exercises to reinforce what you\'ve learned.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {lessonInfo.hasQuiz && (
                    <button className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Take Quiz (Coming Soon)
                    </button>
                  )}
                  {lessonInfo.hasExercises && (
                    <button className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                      Practice Exercises (Coming Soon)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading lesson:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The lesson you're looking for doesn't exist or is not yet available.
          </p>
          <Link
            href={`/${level}/${section}`}
            className="text-red-600 hover:text-red-700 underline"
          >
            ← Back to Section
          </Link>
        </div>
      </div>
    );
  }
}
