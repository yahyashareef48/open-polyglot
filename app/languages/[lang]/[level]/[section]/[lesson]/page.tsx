import Link from "next/link";
import { getLessonContent, getNavigationInfo, getSectionMetadata, getSectionsForLevel, getLanguageMetadata, getLevelMetadata } from "@/lib/content";
import LessonContent from "@/app/components/lessons/LessonContent";
import LessonNavigation from "@/app/components/lessons/LessonNavigation";
import MarkCompleteButton from "@/app/components/lessons/MarkCompleteButton";
import LessonAudioLoader from "@/app/components/lessons/LessonAudioLoader";
import LessonSidebar from "@/app/components/lessons/LessonSidebar";
import LastOpenedTracker from "@/app/components/lessons/LastOpenedTracker";
import ScrollProgressBar from "@/app/components/lessons/ScrollProgressBar";

interface LessonPageProps {
  params: Promise<{
    lang: string;
    level: string;
    section: string;
    lesson: string;
  }>;
}

// Define color themes for each language
const languageThemes: Record<
  string,
  {
    gradient: string;
    darkGradient: string;
    accent: string;
    accentDark: string;
  }
> = {
  german: {
    gradient: "from-black via-[33%] via-red-600 via-[66%] to-amber-500",
    darkGradient: "dark:from-gray-900 dark:via-[33%] dark:via-red-900 dark:via-[66%] dark:to-amber-900",
    accent: "from-red-600 to-amber-500",
    accentDark: "dark:from-red-800 dark:to-amber-700",
  },
  french: {
    gradient: "from-blue-700 via-white to-red-600",
    darkGradient: "dark:from-blue-900 dark:via-gray-800 dark:to-red-900",
    accent: "from-blue-600 to-red-500",
    accentDark: "dark:from-blue-800 dark:to-red-700",
  },
  spanish: {
    gradient: "from-red-600 via-yellow-400 to-red-600",
    darkGradient: "dark:from-red-900 dark:via-yellow-700 dark:to-red-900",
    accent: "from-red-500 to-yellow-500",
    accentDark: "dark:from-red-700 dark:to-yellow-600",
  },
};

// Lesson type icon and color mapping
const lessonTypeConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
  informational: {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  vocabulary: {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  grammar: {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  dialogue: {
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
  },
  practice: {
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  quiz: {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-600 dark:text-red-400",
  },
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lang, level, section, lesson } = await params;

  try {
    const lessonContent = await getLessonContent(lang, level, section, lesson);
    const navigationInfo = await getNavigationInfo(lang, level, section, lesson);
    const sectionMeta = await getSectionMetadata(lang, level, section);
    const allSections = await getSectionsForLevel(lang, level);
    const languageMeta = await getLanguageMetadata(lang);
    const levelMeta = await getLevelMetadata(lang, level);

    // TODO: Get actual user ID from auth context
    const userId = "guest";

    // Find lesson info from section metadata
    const lessonInfo = sectionMeta.lessons.find((l) => l.id === lesson);
    const currentLessonIndex = sectionMeta.lessons.findIndex((l) => l.id === lesson) + 1;

    // Get theme for this language or fallback to default
    const theme = languageThemes[lang] || {
      gradient: "from-blue-600 via-purple-600 to-indigo-700",
      darkGradient: "dark:from-blue-900 dark:via-purple-900 dark:to-indigo-950",
      accent: "from-blue-500 to-purple-500",
      accentDark: "dark:from-blue-700 dark:to-purple-700",
    };

    // Get lesson type config
    const typeConfig = lessonTypeConfig[lessonInfo?.type || "informational"];

    // Prepare sections for sidebar
    const sectionsWithUrls = allSections.map((s) => ({
      ...s,
      url: `/${level}/${s.id}`,
    }));

    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Track last opened lesson */}
        <LastOpenedTracker userId={userId} languageCode={lang} levelId={level} sectionId={section} lessonId={lesson} />

        {/* Load lesson content into audio player */}
        <LessonAudioLoader lessonContent={lessonContent} />

        {/* Sidebar */}
        <LessonSidebar
          sections={sectionsWithUrls}
          currentSectionId={section}
          currentLessonId={lesson}
          levelId={level}
          languageCode={lang}
          userId={userId}
          languageName={languageMeta.name}
          levelName={levelMeta.name}
        />

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto lesson-page-scroll">
          {/* Compact header */}
          <header className={`sticky top-0 z-30 bg-gradient-to-r ${theme.accent} ${theme.accentDark} shadow-lg`}>
            <div className="px-6 lg:px-12 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left side - breadcrumb and title */}
                <div className="flex-1 min-w-0">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                    <span>{sectionMeta.title}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-white/90">Lesson {currentLessonIndex}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl lg:text-2xl font-bold text-white truncate">{lessonContent.title}</h1>
                </div>

                {/* Right side - metadata badges */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {lessonInfo && (
                    <>
                      {/* Type badge */}
                      <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${typeConfig.bgColor}`}>
                        <svg className={`w-4 h-4 ${typeConfig.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeConfig.icon} />
                        </svg>
                        <span className={`text-sm font-medium capitalize ${typeConfig.textColor}`}>{lessonInfo.type}</span>
                      </div>

                      {/* Duration badge */}
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-white">{lessonInfo.estimatedMinutes} min</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Scroll progress bar */}
            <ScrollProgressBar />
          </header>

          {/* Scrollable content */}
          <div className="px-6 lg:px-12 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto max-w-">
              {/* Lesson content card */}
              <article>
                {/* Content */}
                <LessonContent content={lessonContent} />

                {/* Footer with mark complete button */}
                <MarkCompleteButton userId={userId} languageCode={lang} levelId={level} sectionId={section} lessonId={lesson} />
              </article>

              {/* Additional practice section */}
              {lessonInfo && (lessonInfo.hasQuiz || lessonInfo.hasExercises) && (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Practice & Reinforce</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {lessonInfo.hasQuiz && "Test your understanding with a quiz. "}
                        {lessonInfo.hasExercises && "Complete exercises to solidify your learning."}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {lessonInfo.hasQuiz && (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl opacity-60 cursor-not-allowed font-medium"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                            Take Quiz (Coming Soon)
                          </button>
                        )}
                        {lessonInfo.hasExercises && (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl opacity-60 cursor-not-allowed font-medium"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                              />
                            </svg>
                            Practice Exercises (Coming Soon)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading lesson:", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The lesson you&apos;re looking for doesn&apos;t exist or is not yet available.</p>
          <Link
            href={`/${level}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
