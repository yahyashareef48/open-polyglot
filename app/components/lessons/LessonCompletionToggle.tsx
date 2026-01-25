"use client";

import { useState, useEffect } from "react";
import { markLessonComplete, markLessonIncomplete, getLessonProgress } from "@/lib/progress";

interface LessonCompletionToggleProps {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId: string;
  lessonId: string;
}

export default function LessonCompletionToggle({ userId, languageCode, levelId, sectionId, lessonId }: LessonCompletionToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLessonProgress(userId, languageCode, levelId, sectionId, lessonId)
      .then((progress) => setIsCompleted(progress?.completed ?? false))
      .finally(() => setIsLoading(false));
  }, [userId, languageCode, levelId, sectionId, lessonId]);

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    try {
      if (isCompleted) {
        await markLessonIncomplete(userId, languageCode, levelId, sectionId, lessonId);
        setIsCompleted(false);
      } else {
        await markLessonComplete(userId, languageCode, levelId, sectionId, lessonId);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to update lesson status:", error);
      alert("Failed to update lesson status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return null;

  if (isCompleted) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border-2 border-green-600">
          <span className="text-xl">✓</span>
          <span className="font-semibold">Lesson Completed!</span>
        </div>
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating}
          className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isUpdating ? "Updating..." : "Mark as Incomplete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleComplete}
      disabled={isUpdating}
      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
    >
      {isUpdating ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          Marking as Complete...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span>✓</span>
          Mark Lesson as Complete
        </span>
      )}
    </button>
  );
}
