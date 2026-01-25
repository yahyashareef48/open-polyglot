"use client";

import { useState, useEffect } from "react";
import { markLessonComplete, getLessonProgress } from "@/lib/progress";

interface MarkCompleteButtonProps {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId: string;
  lessonId: string;
}

export default function MarkCompleteButton({ userId, languageCode, levelId, sectionId, lessonId }: MarkCompleteButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLessonProgress(userId, languageCode, levelId, sectionId, lessonId)
      .then((progress) => setIsCompleted(progress?.completed ?? false))
      .finally(() => setIsLoading(false));
  }, [userId, languageCode, levelId, sectionId, lessonId]);

  const handleMarkComplete = async () => {
    setIsCompleting(true);

    try {
      await markLessonComplete(userId, languageCode, levelId, sectionId, lessonId);
      setIsCompleted(true);

      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
      alert("Failed to mark lesson as complete. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) return null;

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border-2 border-green-600">
        <span className="text-xl">✓</span>
        <span className="font-semibold">Lesson Completed!</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleMarkComplete}
      disabled={isCompleting}
      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
    >
      {isCompleting ? (
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
