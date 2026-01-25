"use client";

import { useEffect, useState, useCallback } from "react";
import { getCompletionPercentage, getSectionProgress, eventBus, ProgressEventData } from "@/lib/progress";
import { EVENTS } from "@/app/types/events";

interface ProgressCircleProps {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId?: string;
  totalLessons: number;
}

export default function ProgressBar({ userId, languageCode, levelId, sectionId, totalLessons }: ProgressCircleProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const loadProgress = useCallback(async () => {
    let percentage = 0;
    if (sectionId) {
      const progress = await getSectionProgress(userId, languageCode, levelId, sectionId, totalLessons);
      percentage = progress.percentComplete;
    } else {
      percentage = await getCompletionPercentage(userId, languageCode, levelId, totalLessons);
    }
    setCompletionPercentage(percentage);
  }, [userId, languageCode, levelId, sectionId, totalLessons]);

  // Load progress on mount and when dependencies change
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Listen for progress events and refresh
  useEffect(() => {
    const handleProgressChange = (data: ProgressEventData) => {
      // Only refresh if the event is for the same level (and section if specified)
      if (data.userId === userId && data.languageCode === languageCode && data.levelId === levelId && (!sectionId || data.sectionId === sectionId)) {
        loadProgress();
      }
    };

    eventBus.on(EVENTS.LESSON_COMPLETED, handleProgressChange);
    eventBus.on(EVENTS.LESSON_INCOMPLETED, handleProgressChange);

    return () => {
      eventBus.off(EVENTS.LESSON_COMPLETED, handleProgressChange);
      eventBus.off(EVENTS.LESSON_INCOMPLETED, handleProgressChange);
    };
  }, [userId, languageCode, levelId, sectionId, loadProgress]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/70">Progress</span>
        <span className="text-sm font-bold text-white">{Math.round(completionPercentage)}%</span>
      </div>
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%`, backgroundColor: "#34d399" }}
        />
      </div>
    </div>
  );
}
