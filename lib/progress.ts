/**
 * Progress tracking utilities for Open Polyglot
 *
 * Uses IndexedDB for persistent storage of user progress.
 * Falls back to localStorage if IndexedDB is not available.
 */

import {
  UserProgress,
  LevelProgress,
  SectionProgress,
  LessonProgress,
} from '@/app/types/content';

const DB_NAME = 'OpenPolyglotDB';
const DB_VERSION = 1;
const PROGRESS_STORE = 'progress';
const FALLBACK_KEY_PREFIX = 'open-polyglot-progress-';

// ============================================================================
// IndexedDB Setup
// ============================================================================

/**
 * Initialize IndexedDB
 */
function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create progress object store if it doesn't exist
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const objectStore = db.createObjectStore(PROGRESS_STORE, { keyPath: 'userId' });
        objectStore.createIndex('languageCode', 'languageCode', { unique: false });
        objectStore.createIndex('lastActive', 'lastActive', { unique: false });
      }
    };
  });
}

// ============================================================================
// IndexedDB Operations
// ============================================================================

/**
 * Save progress to IndexedDB
 */
async function saveToIndexedDB(progress: UserProgress): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PROGRESS_STORE);
    const request = objectStore.put(progress);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load progress from IndexedDB
 */
async function loadFromIndexedDB(userId: string): Promise<UserProgress | null> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const objectStore = transaction.objectStore(PROGRESS_STORE);
    const request = objectStore.get(userId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// ============================================================================
// LocalStorage Fallback
// ============================================================================

/**
 * Save progress to localStorage (fallback)
 */
function saveToLocalStorage(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  const key = `${FALLBACK_KEY_PREFIX}${progress.userId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Load progress from localStorage (fallback)
 */
function loadFromLocalStorage(userId: string): UserProgress | null {
  if (typeof window === 'undefined') return null;

  const key = `${FALLBACK_KEY_PREFIX}${userId}`;
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse progress from localStorage:', error);
    return null;
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize progress for a new user
 */
export function createUserProgress(
  userId: string,
  languageCode: string,
  startLevel: string = 'a1'
): UserProgress {
  const now = new Date().toISOString();

  return {
    userId,
    languageCode,
    currentLevel: startLevel,
    levels: [],
    totalTimeSpent: 0,
    streak: 0,
    lastActive: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Save user progress
 */
export async function saveProgress(progress: UserProgress): Promise<void> {
  progress.updatedAt = new Date().toISOString();

  try {
    await saveToIndexedDB(progress);
  } catch (error) {
    console.warn('IndexedDB save failed, falling back to localStorage:', error);
    saveToLocalStorage(progress);
  }
}

/**
 * Load user progress
 */
export async function loadProgress(userId: string): Promise<UserProgress | null> {
  try {
    return await loadFromIndexedDB(userId);
  } catch (error) {
    console.warn('IndexedDB load failed, falling back to localStorage:', error);
    return loadFromLocalStorage(userId);
  }
}

/**
 * Get or create user progress
 */
export async function getOrCreateProgress(
  userId: string,
  languageCode: string
): Promise<UserProgress> {
  const existing = await loadProgress(userId);

  if (existing) {
    return existing;
  }

  const newProgress = createUserProgress(userId, languageCode);
  await saveProgress(newProgress);
  return newProgress;
}

// ============================================================================
// Lesson Progress Functions
// ============================================================================

/**
 * Mark a lesson as complete
 */
export async function markLessonComplete(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string,
  score?: number,
  timeSpent?: number
): Promise<void> {
  const progress = await getOrCreateProgress(userId, languageCode);

  // Find or create level progress
  let levelProgress = progress.levels.find(l => l.levelId === levelId);
  if (!levelProgress) {
    levelProgress = {
      levelId,
      currentSection: sectionId,
      currentLesson: lessonId,
      sections: [],
      overallProgress: 0,
    };
    progress.levels.push(levelProgress);
  }

  // Find or create section progress
  let sectionProgress = levelProgress.sections.find(s => s.sectionId === sectionId);
  if (!sectionProgress) {
    sectionProgress = {
      sectionId,
      completedLessons: 0,
      totalLessons: 0,
      percentComplete: 0,
      lessons: [],
    };
    levelProgress.sections.push(sectionProgress);
  }

  // Find or create lesson progress
  let lessonProgress = sectionProgress.lessons.find(l => l.lessonId === lessonId);
  if (!lessonProgress) {
    lessonProgress = {
      lessonId,
      completed: false,
    };
    sectionProgress.lessons.push(lessonProgress);
    sectionProgress.totalLessons++;
  }

  // Update lesson progress
  if (!lessonProgress.completed) {
    lessonProgress.completed = true;
    lessonProgress.completedAt = new Date().toISOString();
    sectionProgress.completedLessons++;
  }

  if (score !== undefined) {
    lessonProgress.score = score;
  }

  if (timeSpent !== undefined) {
    lessonProgress.timeSpent = timeSpent;
    progress.totalTimeSpent += timeSpent;
  }

  // Update section progress percentage
  sectionProgress.percentComplete = (sectionProgress.completedLessons / sectionProgress.totalLessons) * 100;

  // Update level progress percentage
  const totalSectionProgress = levelProgress.sections.reduce(
    (sum, section) => sum + section.percentComplete,
    0
  );
  levelProgress.overallProgress = totalSectionProgress / levelProgress.sections.length;

  // Update current position
  levelProgress.currentSection = sectionId;
  levelProgress.currentLesson = lessonId;

  // Update streak
  updateStreak(progress);

  await saveProgress(progress);
}

/**
 * Get progress for a specific lesson
 */
export async function getLessonProgress(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  const progress = await loadProgress(userId);
  if (!progress) return null;

  const levelProgress = progress.levels.find(l => l.levelId === levelId);
  if (!levelProgress) return null;

  const sectionProgress = levelProgress.sections.find(s => s.sectionId === sectionId);
  if (!sectionProgress) return null;

  return sectionProgress.lessons.find(l => l.lessonId === lessonId) || null;
}

/**
 * Check if a lesson is completed
 */
export async function isLessonCompleted(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<boolean> {
  const lessonProgress = await getLessonProgress(userId, languageCode, levelId, sectionId, lessonId);
  return lessonProgress?.completed ?? false;
}

/**
 * Get current lesson for user
 */
export async function getCurrentLesson(
  userId: string,
  languageCode: string
): Promise<{ levelId: string; sectionId: string; lessonId: string } | null> {
  const progress = await loadProgress(userId);
  if (!progress || progress.levels.length === 0) return null;

  const currentLevel = progress.levels.find(l => l.levelId === progress.currentLevel);
  if (!currentLevel) return null;

  return {
    levelId: currentLevel.levelId,
    sectionId: currentLevel.currentSection,
    lessonId: currentLevel.currentLesson,
  };
}

// ============================================================================
// Section and Level Progress Functions
// ============================================================================

/**
 * Get section progress
 */
export async function getSectionProgress(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string
): Promise<SectionProgress | null> {
  const progress = await loadProgress(userId);
  if (!progress) return null;

  const levelProgress = progress.levels.find(l => l.levelId === levelId);
  if (!levelProgress) return null;

  return levelProgress.sections.find(s => s.sectionId === sectionId) || null;
}

/**
 * Get level progress
 */
export async function getLevelProgress(
  userId: string,
  languageCode: string,
  levelId: string
): Promise<LevelProgress | null> {
  const progress = await loadProgress(userId);
  if (!progress) return null;

  return progress.levels.find(l => l.levelId === levelId) || null;
}

/**
 * Get completion percentage for a level
 */
export async function getCompletionPercentage(
  userId: string,
  languageCode: string,
  levelId: string
): Promise<number> {
  const levelProgress = await getLevelProgress(userId, languageCode, levelId);
  return levelProgress?.overallProgress ?? 0;
}

// ============================================================================
// Streak Functions
// ============================================================================

/**
 * Update user's learning streak
 */
function updateStreak(progress: UserProgress): void {
  const now = new Date();
  const lastActive = new Date(progress.lastActive);

  const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change to streak
    return;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    progress.streak++;
  } else {
    // Streak broken, reset to 1
    progress.streak = 1;
  }

  progress.lastActive = now.toISOString();
}

/**
 * Get user's current streak
 */
export async function getStreak(userId: string): Promise<number> {
  const progress = await loadProgress(userId);
  return progress?.streak ?? 0;
}

// ============================================================================
// Statistics Functions
// ============================================================================

/**
 * Get total time spent learning
 */
export async function getTotalTimeSpent(userId: string): Promise<number> {
  const progress = await loadProgress(userId);
  return progress?.totalTimeSpent ?? 0;
}

/**
 * Get statistics for user progress
 */
export async function getStatistics(userId: string, languageCode: string): Promise<{
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  currentStreak: number;
  levelsInProgress: number;
  overallProgress: number;
}> {
  const progress = await loadProgress(userId);

  if (!progress) {
    return {
      totalLessonsCompleted: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      levelsInProgress: 0,
      overallProgress: 0,
    };
  }

  const totalLessonsCompleted = progress.levels.reduce(
    (total, level) =>
      total + level.sections.reduce((sum, section) => sum + section.completedLessons, 0),
    0
  );

  const levelsInProgress = progress.levels.length;

  const overallProgress = progress.levels.reduce(
    (sum, level) => sum + level.overallProgress,
    0
  ) / Math.max(levelsInProgress, 1);

  return {
    totalLessonsCompleted,
    totalTimeSpent: progress.totalTimeSpent,
    currentStreak: progress.streak,
    levelsInProgress,
    overallProgress,
  };
}

// ============================================================================
// Reset Functions
// ============================================================================

/**
 * Reset all progress for a user (use with caution!)
 */
export async function resetProgress(userId: string): Promise<void> {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PROGRESS_STORE);
    objectStore.delete(userId);
  } catch (error) {
    console.warn('IndexedDB delete failed, falling back to localStorage:', error);
    const key = `${FALLBACK_KEY_PREFIX}${userId}`;
    localStorage.removeItem(key);
  }
}
