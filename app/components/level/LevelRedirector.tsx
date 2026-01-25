"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLastOpenedLesson } from "@/lib/progress";

interface LevelRedirectorProps {
  userId: string;
  languageCode: string;
  levelId: string;
  firstLessonPath: string; // fallback: /{level}/{section}/{lesson}
}

/**
 * Client component that checks for last opened lesson and redirects accordingly.
 * Shows a loading state while checking.
 */
export default function LevelRedirector({
  userId,
  languageCode,
  levelId,
  firstLessonPath,
}: LevelRedirectorProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const lastOpened = await getLastOpenedLesson(userId, languageCode);

        if (lastOpened && lastOpened.levelId === levelId) {
          // Redirect to last opened lesson in this level
          router.replace(`/${lastOpened.levelId}/${lastOpened.sectionId}/${lastOpened.lessonId}`);
        } else {
          // Redirect to first lesson
          router.replace(firstLessonPath);
        }
      } catch (error) {
        console.warn("Failed to get last opened lesson:", error);
        router.replace(firstLessonPath);
      }
    };

    checkAndRedirect();
  }, [userId, languageCode, levelId, firstLessonPath, router]);

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Loading your lesson...</p>
      </div>
    </div>
  );
}
