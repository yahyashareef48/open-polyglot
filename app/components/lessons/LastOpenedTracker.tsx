"use client";

import { useEffect } from "react";
import { saveLastOpenedLesson } from "@/lib/progress";

interface LastOpenedTrackerProps {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId: string;
  lessonId: string;
}

/**
 * Client component that saves the last opened lesson when the lesson page is loaded.
 * This is a hidden component that only runs the effect on mount.
 */
export default function LastOpenedTracker({
  userId,
  languageCode,
  levelId,
  sectionId,
  lessonId,
}: LastOpenedTrackerProps) {
  useEffect(() => {
    saveLastOpenedLesson(userId, languageCode, levelId, sectionId, lessonId);
  }, [userId, languageCode, levelId, sectionId, lessonId]);

  return null;
}
