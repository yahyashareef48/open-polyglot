/**
 * Level Layout
 * Wraps lesson pages with AudioPlayerProvider, renders the sidebar and AudioPlayer component
 * The sidebar is rendered here so it persists across lesson navigation (no re-render when switching lessons)
 */

import { ReactNode } from 'react';
import { getSectionsForLevel, getLanguageMetadata, getLevelMetadata } from '@/lib/content';
import LessonSidebar from '@/app/components/lessons/LessonSidebar';
import LessonLayoutClient from './LessonLayoutClient';

interface LevelLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang: string;
    level: string;
  }>;
}

export default async function LevelLayout({ children, params }: LevelLayoutProps) {
  const { lang, level } = await params;

  // Fetch sidebar data at the level layout so it persists across lesson changes
  const allSections = await getSectionsForLevel(lang, level);
  const languageMeta = await getLanguageMetadata(lang);
  const levelMeta = await getLevelMetadata(lang, level);

  // TODO: Get actual user ID from auth context
  const userId = 'guest';

  // Prepare sections for sidebar
  const sectionsWithUrls = allSections.map((s) => ({
    ...s,
    url: `/${level}/${s.id}`,
  }));

  return (
    <LessonLayoutClient>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <LessonSidebar
          sections={sectionsWithUrls}
          levelId={level}
          languageCode={lang}
          userId={userId}
          languageName={languageMeta.name}
          levelName={levelMeta.name}
        />
        <main className="flex-1 min-w-0 overflow-y-auto lesson-page-scroll">
          {children}
        </main>
      </div>
    </LessonLayoutClient>
  );
}
