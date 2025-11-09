/**
 * Content loading utilities for Open Polyglot
 *
 * These functions load and parse JSON content from the public/content directory.
 * All content is stored as static JSON files and loaded at runtime.
 */

import {
  LanguageMetadata,
  LevelMetadata,
  SectionMetadata,
  LessonContent,
  Quiz,
  Exercises,
  NavigationInfo,
  BreadcrumbItem,
  ContentPath,
} from '@/app/types/content';
import { readFile } from 'fs/promises';
import { join } from 'path';

const CONTENT_BASE_PATH = 'public/content/languages';

/**
 * Generic function to read and parse JSON content from the filesystem
 */
async function readJSON<T>(relativePath: string): Promise<T> {
  const filePath = join(process.cwd(), CONTENT_BASE_PATH, relativePath);

  try {
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Failed to read content from ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Language Metadata Functions
// ============================================================================

/**
 * Get metadata for a specific language
 * @param languageCode - Language code (e.g., 'german', 'french')
 */
export async function getLanguageMetadata(languageCode: string): Promise<LanguageMetadata> {
  const path = `${languageCode}/metadata.json`;
  return readJSON<LanguageMetadata>(path);
}

/**
 * Get all available languages
 */
export async function getAllLanguages(): Promise<string[]> {
  // For now, return hardcoded list
  // In the future, this could read from a directory listing or index file
  return ['german'];
}

// ============================================================================
// Level Metadata Functions
// ============================================================================

/**
 * Get metadata for a specific level
 * @param languageCode - Language code
 * @param levelId - Level ID (e.g., 'a1', 'a2')
 */
export async function getLevelMetadata(
  languageCode: string,
  levelId: string
): Promise<LevelMetadata> {
  const path = `${languageCode}/${levelId}/metadata.json`;
  return readJSON<LevelMetadata>(path);
}

/**
 * Get all available levels for a language
 * @param languageCode - Language code
 */
export async function getAvailableLevels(languageCode: string): Promise<string[]> {
  const metadata = await getLanguageMetadata(languageCode);
  return metadata.availableLevels
    .filter(level => level.enabled)
    .map(level => level.id);
}

// ============================================================================
// Section Metadata Functions
// ============================================================================

/**
 * Get metadata for a specific section
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID (e.g., 'intro', 'chapter-01')
 */
export async function getSectionMetadata(
  languageCode: string,
  levelId: string,
  sectionId: string
): Promise<SectionMetadata> {
  const path = `${languageCode}/${levelId}/${sectionId}/metadata.json`;
  return readJSON<SectionMetadata>(path);
}

/**
 * Get all sections for a level
 * @param languageCode - Language code
 * @param levelId - Level ID
 */
export async function getSectionsForLevel(
  languageCode: string,
  levelId: string
): Promise<SectionMetadata[]> {
  const levelMeta = await getLevelMetadata(languageCode, levelId);

  // Fetch metadata for each section
  const sectionPromises = levelMeta.sections
    .filter(section => section.enabled)
    .map(section => getSectionMetadata(languageCode, levelId, section.id));

  return Promise.all(sectionPromises);
}

// ============================================================================
// Lesson Content Functions
// ============================================================================

/**
 * Get content for a specific lesson
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID
 * @param lessonId - Lesson ID (e.g., '01-welcome')
 */
export async function getLessonContent(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<LessonContent> {
  const path = `${languageCode}/${levelId}/${sectionId}/lessons/${lessonId}/content.json`;
  return readJSON<LessonContent>(path);
}

/**
 * Get all lessons for a section
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID
 */
export async function getLessonsForSection(
  languageCode: string,
  levelId: string,
  sectionId: string
): Promise<LessonContent[]> {
  const sectionMeta = await getSectionMetadata(languageCode, levelId, sectionId);

  // Fetch content for each lesson
  const lessonPromises = sectionMeta.lessons.map(lesson =>
    getLessonContent(languageCode, levelId, sectionId, lesson.id)
  );

  return Promise.all(lessonPromises);
}

// ============================================================================
// Quiz and Exercise Functions
// ============================================================================

/**
 * Get quiz for a specific lesson
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID
 * @param lessonId - Lesson ID
 */
export async function getQuiz(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<Quiz | null> {
  try {
    const path = `${languageCode}/${levelId}/${sectionId}/lessons/${lessonId}/quiz.json`;
    return await readJSON<Quiz>(path);
  } catch (error) {
    // Quiz might not exist for this lesson
    return null;
  }
}

/**
 * Get exercises for a specific lesson
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID
 * @param lessonId - Lesson ID
 */
export async function getExercises(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<Exercises | null> {
  try {
    const path = `${languageCode}/${levelId}/${sectionId}/lessons/${lessonId}/exercises.json`;
    return await readJSON<Exercises>(path);
  } catch (error) {
    // Exercises might not exist for this lesson
    return null;
  }
}

// ============================================================================
// Navigation Functions
// ============================================================================

/**
 * Get navigation info (previous/next lessons) for a lesson
 * @param languageCode - Language code
 * @param levelId - Level ID
 * @param sectionId - Section ID
 * @param lessonId - Lesson ID
 */
export async function getNavigationInfo(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<NavigationInfo> {
  const sectionMeta = await getSectionMetadata(languageCode, levelId, sectionId);

  const currentIndex = sectionMeta.lessons.findIndex(l => l.id === lessonId);

  if (currentIndex === -1) {
    throw new Error(`Lesson ${lessonId} not found in section ${sectionId}`);
  }

  const previousLesson = currentIndex > 0 ? sectionMeta.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sectionMeta.lessons.length - 1 ? sectionMeta.lessons[currentIndex + 1] : null;

  return {
    previous: previousLesson ? {
      id: previousLesson.id,
      title: previousLesson.title,
      url: `/${levelId}/${sectionId}/${previousLesson.id}`,
    } : undefined,
    next: nextLesson ? {
      id: nextLesson.id,
      title: nextLesson.title,
      url: `/${levelId}/${sectionId}/${nextLesson.id}`,
    } : undefined,
    parent: {
      type: 'section',
      title: sectionMeta.title,
      url: `/${levelId}/${sectionId}`,
    },
  };
}

/**
 * Generate breadcrumb trail for current location
 * @param path - Current content path
 */
export async function getBreadcrumbs(path: Partial<ContentPath>): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [];

  // Home
  breadcrumbs.push({
    label: 'Home',
    url: '/',
    active: false,
  });

  if (!path.language) {
    return breadcrumbs;
  }

  // Language
  const langMeta = await getLanguageMetadata(path.language);
  breadcrumbs.push({
    label: langMeta.name,
    url: `/`,
    active: !path.level,
  });

  if (!path.level) {
    return breadcrumbs;
  }

  // Level
  const levelMeta = await getLevelMetadata(path.language, path.level);
  breadcrumbs.push({
    label: levelMeta.name,
    url: `/${path.level}`,
    active: !path.section,
  });

  if (!path.section) {
    return breadcrumbs;
  }

  // Section
  const sectionMeta = await getSectionMetadata(path.language, path.level, path.section);
  breadcrumbs.push({
    label: sectionMeta.title,
    url: `/${path.level}/${path.section}`,
    active: !path.lesson,
  });

  if (!path.lesson) {
    return breadcrumbs;
  }

  // Lesson
  const lesson = sectionMeta.lessons.find(l => l.id === path.lesson);
  if (lesson) {
    breadcrumbs.push({
      label: lesson.title,
      url: `/${path.level}/${path.section}/${path.lesson}`,
      active: true,
    });
  }

  return breadcrumbs;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a lesson has a quiz
 */
export async function hasQuiz(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<boolean> {
  const sectionMeta = await getSectionMetadata(languageCode, levelId, sectionId);
  const lesson = sectionMeta.lessons.find(l => l.id === lessonId);
  return lesson?.hasQuiz ?? false;
}

/**
 * Check if a lesson has exercises
 */
export async function hasExercises(
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<boolean> {
  const sectionMeta = await getSectionMetadata(languageCode, levelId, sectionId);
  const lesson = sectionMeta.lessons.find(l => l.id === lessonId);
  return lesson?.hasExercises ?? false;
}

/**
 * Get total lesson count for a level
 */
export async function getTotalLessonCount(
  languageCode: string,
  levelId: string
): Promise<number> {
  const sections = await getSectionsForLevel(languageCode, levelId);
  return sections.reduce((total, section) => total + section.lessons.length, 0);
}
