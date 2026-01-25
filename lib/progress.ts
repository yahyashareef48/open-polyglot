/**
 * Progress tracking for Open Polyglot
 * Uses IndexedDB with localStorage fallback
 */

import { User, Lesson, Session } from '@/app/types/content';
import { EventEmitter } from 'events';

// Event emitter for progress changes
export const progressEvents = new EventEmitter();

export type ProgressEventData = {
  userId: string;
  languageCode: string;
  levelId: string;
  sectionId: string;
  lessonId: string;
};

export const PROGRESS_EVENTS = {
  LESSON_COMPLETED: 'lesson:completed',
  LESSON_INCOMPLETED: 'lesson:incompleted',
} as const;

const DB_NAME = 'OpenPolyglotDB';
const DB_VERSION = 3;
const STORES = {
  users: 'users',
  lessons: 'lessons',
  sessions: 'sessions',
} as const;

let dbInstance: IDBDatabase | null = null;

function isServer(): boolean {
  return typeof window === 'undefined';
}

function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (isServer() || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.users)) {
        db.createObjectStore(STORES.users, { keyPath: 'userId' });
      }
      if (!db.objectStoreNames.contains(STORES.lessons)) {
        const store = db.createObjectStore(STORES.lessons, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const store = db.createObjectStore(STORES.sessions, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
}

async function dbGet<T>(store: string, key: string): Promise<T | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut<T>(store: string, data: T): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(data);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ============================================================================
// User functions
// ============================================================================

async function getOrCreateUser(userId: string): Promise<User> {
  if (isServer()) {
    return { userId, createdAt: '', lastActive: '', streak: 0, totalTimeSpent: 0 };
  }

  try {
    let user = await dbGet<User>(STORES.users, userId);
    if (!user) {
      const now = new Date().toISOString();
      user = { userId, createdAt: now, lastActive: now, streak: 0, totalTimeSpent: 0 };
      await dbPut(STORES.users, user);
    }
    return user;
  } catch {
    return { userId, createdAt: '', lastActive: '', streak: 0, totalTimeSpent: 0 };
  }
}

function updateStreak(user: User): void {
  const now = new Date();
  const lastActive = new Date(user.lastActive);
  const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    user.streak++;
  } else if (daysDiff > 1) {
    user.streak = 1;
  }
  user.lastActive = now.toISOString();
}

// ============================================================================
// Lesson functions
// ============================================================================

function makeLessonKey(userId: string, lang: string, level: string, section: string, lesson: string): string {
  return `${userId}:${lang}:${level}:${section}:${lesson}`;
}

async function getLessonRecord(
  userId: string,
  lang: string,
  level: string,
  section: string,
  lesson: string
): Promise<Lesson | null> {
  if (isServer()) return null;

  try {
    return await dbGet<Lesson>(STORES.lessons, makeLessonKey(userId, lang, level, section, lesson));
  } catch {
    return null;
  }
}

// ============================================================================
// Public API
// ============================================================================

export async function markLessonComplete(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<void> {
  if (isServer()) return;

  try {
    const lesson: Lesson = {
      id: makeLessonKey(userId, languageCode, levelId, sectionId, lessonId),
      lessonId,
      sectionId,
      levelId,
      languageCode,
      userId,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    await dbPut(STORES.lessons, lesson);

    const user = await getOrCreateUser(userId);
    updateStreak(user);
    await dbPut(STORES.users, user);

    // Emit event for lesson completion
    progressEvents.emit(PROGRESS_EVENTS.LESSON_COMPLETED, {
      userId,
      languageCode,
      levelId,
      sectionId,
      lessonId,
    } as ProgressEventData);
  } catch (error) {
    console.warn('Failed to mark lesson complete:', error);
  }
}

export async function markLessonIncomplete(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<void> {
  if (isServer()) return;

  try {
    const db = await getDB();
    const key = makeLessonKey(userId, languageCode, levelId, sectionId, lessonId);

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.lessons, 'readwrite');
      const req = tx.objectStore(STORES.lessons).delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Emit event for lesson incompletion
    progressEvents.emit(PROGRESS_EVENTS.LESSON_INCOMPLETED, {
      userId,
      languageCode,
      levelId,
      sectionId,
      lessonId,
    } as ProgressEventData);
  } catch (error) {
    console.warn('Failed to mark lesson incomplete:', error);
  }
}

export async function getLessonProgress(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<{ completed: boolean } | null> {
  if (isServer()) return null;

  try {
    const lesson = await getLessonRecord(userId, languageCode, levelId, sectionId, lessonId);
    return { completed: lesson?.completed ?? false };
  } catch {
    return null;
  }
}

async function getAllLessonsForUser(userId: string): Promise<Lesson[]> {
  if (isServer()) return [];

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.lessons, 'readonly');
      const index = tx.objectStore(STORES.lessons).index('userId');
      const req = index.getAll(userId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function getSectionProgress(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  totalLessons: number
): Promise<{ completedLessons: number; percentComplete: number }> {
  if (isServer()) return { completedLessons: 0, percentComplete: 0 };

  try {
    const allLessons = await getAllLessonsForUser(userId);
    const sectionLessons = allLessons.filter(
      (l) => l.languageCode === languageCode && l.levelId === levelId && l.sectionId === sectionId && l.completed
    );

    return {
      completedLessons: sectionLessons.length,
      percentComplete: totalLessons > 0 ? (sectionLessons.length / totalLessons) * 100 : 0,
    };
  } catch {
    return { completedLessons: 0, percentComplete: 0 };
  }
}

export async function getCompletionPercentage(
  userId: string,
  languageCode: string,
  levelId: string,
  totalLessons: number
): Promise<number> {
  if (isServer()) return 0;

  try {
    const allLessons = await getAllLessonsForUser(userId);
    const levelLessons = allLessons.filter(
      (l) => l.languageCode === languageCode && l.levelId === levelId && l.completed
    );

    return totalLessons > 0 ? (levelLessons.length / totalLessons) * 100 : 0;
  } catch {
    return 0;
  }
}

export async function getStreak(userId: string): Promise<number> {
  if (isServer()) return 0;

  try {
    const user = await dbGet<User>(STORES.users, userId);
    return user?.streak ?? 0;
  } catch {
    return 0;
  }
}

export async function logSession(
  userId: string,
  languageCode: string,
  duration: number,
  activityType: Session['activityType']
): Promise<void> {
  if (isServer()) return;

  try {
    const session: Session = {
      id: `${userId}:${Date.now()}`,
      userId,
      languageCode,
      duration,
      activityType,
      timestamp: new Date().toISOString(),
    };
    await dbPut(STORES.sessions, session);

    // Update user's total time
    const user = await getOrCreateUser(userId);
    user.totalTimeSpent += duration;
    await dbPut(STORES.users, user);
  } catch (error) {
    console.warn('Failed to log session:', error);
  }
}

export async function resetProgress(userId: string): Promise<void> {
  if (isServer()) return;

  try {
    const db = await getDB();
    const storeNames = [STORES.users, STORES.lessons, STORES.sessions];
    const tx = db.transaction(storeNames, 'readwrite');

    tx.objectStore(STORES.users).delete(userId);

    for (const storeName of [STORES.lessons, STORES.sessions]) {
      const store = tx.objectStore(storeName);
      const index = store.index('userId');
      const req = index.openCursor(IDBKeyRange.only(userId));
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    }
  } catch (error) {
    console.warn('Failed to reset progress:', error);
  }
}

// ============================================================================
// Last Opened Lesson Tracking
// ============================================================================

/**
 * Save the last opened lesson for a language
 * @param userId - User ID
 * @param languageCode - Language code (e.g., 'german')
 * @param levelId - Level ID (e.g., 'a1')
 * @param sectionId - Section ID
 * @param lessonId - Lesson ID
 */
export async function saveLastOpenedLesson(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string,
  lessonId: string
): Promise<void> {
  if (isServer()) return;

  try {
    const user = await getOrCreateUser(userId);
    if (!user.lastOpened) {
      user.lastOpened = {};
    }
    user.lastOpened[languageCode] = `${levelId}:${sectionId}:${lessonId}`;
    await dbPut(STORES.users, user);
  } catch (error) {
    console.warn('Failed to save last opened lesson:', error);
  }
}

/**
 * Get the last opened lesson for a language
 * @param userId - User ID
 * @param languageCode - Language code
 * @returns Object with level, section, lesson IDs or null if not found
 */
export async function getLastOpenedLesson(
  userId: string,
  languageCode: string
): Promise<{ levelId: string; sectionId: string; lessonId: string } | null> {
  if (isServer()) return null;

  try {
    const user = await dbGet<User>(STORES.users, userId);
    if (!user?.lastOpened?.[languageCode]) {
      return null;
    }

    const [levelId, sectionId, lessonId] = user.lastOpened[languageCode].split(':');
    if (!levelId || !sectionId || !lessonId) {
      return null;
    }

    return { levelId, sectionId, lessonId };
  } catch {
    return null;
  }
}
