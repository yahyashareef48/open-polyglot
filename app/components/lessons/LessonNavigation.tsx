/**
 * LessonNavigation Component
 *
 * Provides previous/next navigation between lessons
 */

import Link from 'next/link';
import { NavigationInfo } from '@/app/types/content';

interface LessonNavigationProps {
  navigationInfo: NavigationInfo;
}

export default function LessonNavigation({ navigationInfo }: LessonNavigationProps) {
  const { previous, next } = navigationInfo;

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous lesson */}
      <div className="flex-1">
        {previous ? (
          <Link
            href={previous.url}
            className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-600"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                ←
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Previous
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-600 transition-colors">
                {previous.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-50">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Previous
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No previous lesson
            </div>
          </div>
        )}
      </div>

      {/* Next lesson */}
      <div className="flex-1">
        {next ? (
          <Link
            href={next.url}
            className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-600"
          >
            <div className="flex-1 min-w-0 text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Next
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-600 transition-colors">
                {next.title}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                →
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-50 text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Next
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No next lesson
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
