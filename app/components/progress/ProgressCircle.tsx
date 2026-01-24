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
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-white/20"
        />
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 56}`}
          strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
          className="text-emerald-400 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {Math.round(completionPercentage)}%
        </span>
        <span className="text-xs text-white/70">Complete</span>
      </div>
    </div>
  );
}
