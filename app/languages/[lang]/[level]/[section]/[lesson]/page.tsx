import Link from 'next/link';
import { getLessonContent, getNavigationInfo, getSectionMetadata } from '@/lib/content';
import { getLessonProgress } from '@/lib/progress';
import LessonContent from '@/app/components/lessons/LessonContent';
import LessonNavigation from '@/app/components/lessons/LessonNavigation';
import MarkCompleteButton from '@/app/components/lessons/MarkCompleteButton';

interface LessonPageProps {
  params: Promise<{
    lang: string;
    level: string;
    section: string;
    lesson: string;
  }>;
}

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

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href={navigationInfo.parent.url}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-block"
            >
              ← Back to {navigationInfo.parent.title}
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {lessonContent.title}
                </h1>
                {lessonInfo && (
                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <span>⏱️</span>
                      {lessonInfo.estimatedMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                      {lessonInfo.type}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-green-700 dark:text-green-300">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lesson content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
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
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Additional Practice Available
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {lessonInfo.hasQuiz && 'Take the quiz to test your knowledge. '}
                {lessonInfo.hasExercises && 'Complete exercises to reinforce what you\'ve learned.'}
              </p>
              <div className="mt-4 flex gap-3">
                {lessonInfo.hasQuiz && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📝 Take Quiz (Coming Soon)
                  </button>
                )}
                {lessonInfo.hasExercises && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    💪 Practice Exercises (Coming Soon)
                  </button>
                )}
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
