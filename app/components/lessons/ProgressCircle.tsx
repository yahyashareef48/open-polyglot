'use client';

import { useEffect, useState } from 'react';
import { getCompletionPercentage, getSectionProgress } from '@/lib/progress';

interface ProgressCircleProps {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId?: string;
  totalLessons: number;
}

export default function ProgressCircle({
  userId,
  languageCode,
  levelId,
  sectionId,
  totalLessons,
}: ProgressCircleProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      let percentage = 0;
      if (sectionId) {
        const progress = await getSectionProgress(
          userId,
          languageCode,
          levelId,
          sectionId,
          totalLessons
        );
        percentage = progress.percentComplete;
      } else {
        percentage = await getCompletionPercentage(
          userId,
          languageCode,
          levelId,
          totalLessons
        );
      }
      setCompletionPercentage(percentage);
    }
    loadProgress();
  }, [userId, languageCode, levelId, sectionId, totalLessons]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/70">Progress</span>
        <span className="text-sm font-bold text-white">
          {Math.round(completionPercentage)}%
        </span>
      </div>
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%`, backgroundColor: '#34d399' }}
        />
      </div>
    </div>
  );
}
