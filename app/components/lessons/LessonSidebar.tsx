"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SectionMetadata, LessonInfo } from "@/app/types/content";
import { getLessonProgress } from "@/lib/progress";
import ProgressCircle from "./ProgressCircle";

interface SectionWithMeta extends SectionMetadata {
  url: string;
}

interface LessonSidebarProps {
  sections: SectionWithMeta[];
  currentSectionId: string;
  currentLessonId: string;
  levelId: string;
  languageCode: string;
  userId: string;
  languageName: string;
  levelName: string;
}

interface CompletionState {
  [lessonId: string]: boolean;
}

export default function LessonSidebar({
  sections,
  currentSectionId,
  currentLessonId,
  levelId,
  languageCode,
  userId,
  languageName,
  levelName,
}: LessonSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([currentSectionId]));
  const [completionState, setCompletionState] = useState<CompletionState>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load completion states for all lessons
  useEffect(() => {
    const loadCompletionStates = async () => {
      const states: CompletionState = {};
      for (const section of sections) {
        for (const lesson of section.lessons) {
          const progress = await getLessonProgress(userId, languageCode, levelId, section.id, lesson.id);
          states[`${section.id}:${lesson.id}`] = progress?.completed ?? false;
        }
      }
      setCompletionState(states);
    };
    loadCompletionStates();
  }, [sections, userId, languageCode, levelId]);

  // Expand current section when navigating
  useEffect(() => {
    setExpandedSections((prev) => new Set([...prev, currentSectionId]));
    setIsMobileOpen(false);
  }, [currentSectionId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isLessonCompleted = (sectionId: string, lessonId: string) => {
    return completionState[`${sectionId}:${lessonId}`] ?? false;
  };

  const getSectionProgress = (section: SectionMetadata) => {
    const completed = section.lessons.filter((lesson) => isLessonCompleted(section.id, lesson.id)).length;
    return { completed, total: section.lessons.length };
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href={`/`}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
        <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">
          {languageName} {levelName}
        </h2>
        <div className="mt-4 flex justify-center">
          <ProgressCircle
            userId={userId}
            languageCode={languageCode}
            levelId={levelId}
            totalLessons={sections.reduce((acc, section) => acc + section.lessons.length, 0)}
          />
        </div>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.has(section.id);
            const isCurrentSection = section.id === currentSectionId;
            const progress = getSectionProgress(section);

            return (
              <div key={section.id} className="mb-1">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    isCurrentSection
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {/* Expand/collapse icon */}
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>

                  {/* Section number badge */}
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      progress.completed === progress.total && progress.total > 0
                        ? "bg-emerald-500 text-white"
                        : isCurrentSection
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {progress.completed === progress.total && progress.total > 0 ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      sectionIndex + 1
                    )}
                  </span>

                  {/* Section title and progress */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{section.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {progress.completed}/{progress.total} completed
                    </div>
                  </div>
                </button>

                {/* Lessons list */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const isCurrentLesson = section.id === currentSectionId && lesson.id === currentLessonId;
                      const isCompleted = isLessonCompleted(section.id, lesson.id);
                      const lessonUrl = `/${levelId}/${section.id}/${lesson.id}`;

                      return (
                        <Link
                          key={lesson.id}
                          href={lessonUrl}
                          className={`flex items-center gap-3 pl-4 pr-3 py-2.5 ml-2 rounded-lg transition-all duration-200 ${
                            isCurrentLesson
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                              : isCompleted
                                ? "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {/* Lesson status indicator */}
                          <span
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              isCurrentLesson
                                ? "bg-blue-600 text-white"
                                : isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : "border-2 border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {isCompleted ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : isCurrentLesson ? (
                              <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            ) : null}
                          </span>

                          {/* Lesson title */}
                          <span className="flex-1 text-sm truncate">{lesson.title}</span>

                          {/* Lesson type badge */}
                          <span
                            className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${
                              lesson.type === "vocabulary"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : lesson.type === "grammar"
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                  : lesson.type === "dialogue"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : lesson.type === "practice"
                                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                      : lesson.type === "quiz"
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {lesson.type.slice(0, 4)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label="Open course navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar - Desktop (always visible) and Mobile (slide-in) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}
