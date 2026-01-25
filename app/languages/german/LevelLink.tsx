"use client";

import { useRouter } from "next/navigation";
import { getLastOpenedLesson } from "@/lib/progress";

interface LevelLinkProps {
  levelId: string;
  levelName: string;
  languageCode: string;
  firstLesson: {
    levelId: string;
    sectionId: string;
    lessonId: string;
  };
}

export default function LevelLink({ levelId, levelName, languageCode, firstLesson }: LevelLinkProps) {
  const router = useRouter();

  const handleClick = async () => {
    // Try to get the last opened lesson, fallback to first lesson
    const lastOpened = await getLastOpenedLesson("guest", languageCode);

    if (lastOpened) {
      router.push(`/${lastOpened.levelId}/${lastOpened.sectionId}/${lastOpened.lessonId}`);
    } else {
      router.push(`/${firstLesson.levelId}/${firstLesson.sectionId}/${firstLesson.lessonId}`);
    }
  };

  return (
    <button onClick={handleClick} className="group block w-full text-left transform hover:scale-105 transition-transform duration-300">
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/[0.02] dark:from-amber-400/0 dark:via-amber-400/0 dark:to-amber-400/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-red-600 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

        <div className="relative">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300 text-left">{levelName}</h3>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></div>
              Available Now
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-left">Start your German learning journey at the beginner level</p>

          {/* Bottom section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Click to start</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-black opacity-40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
