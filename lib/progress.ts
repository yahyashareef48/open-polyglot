/**
 * Progress tracking for Open Polyglot
 * Uses IndexedDB with localStorage fallback
 */

import { User, LevelProgress, Session } from '@/app/types/content';

const DB_NAME = 'OpenPolyglotDB';
const DB_VERSION = 2;
const STORES = {
  users: 'users',
  userLanguages: 'user_languages',
  levelProgress: 'level_progress',
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
      if (!db.objectStoreNames.contains(STORES.userLanguages)) {
        const store = db.createObjectStore(STORES.userLanguages, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.levelProgress)) {
        const store = db.createObjectStore(STORES.levelProgress, { keyPath: 'id' });
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
// Level Progress functions
// ============================================================================

function makeLevelKey(userId: string, lang: string, level: string): string {
  return `${userId}:${lang}:${level}`;
}

async function getLevelProgressRecord(
  userId: string,
  lang: string,
  level: string
): Promise<LevelProgress | null> {
  if (isServer()) return null;

  try {
    return await dbGet<LevelProgress>(STORES.levelProgress, makeLevelKey(userId, lang, level));
  } catch {
    return null;
  }
}

async function getOrCreateLevelProgress(
  userId: string,
  lang: string,
  level: string
): Promise<LevelProgress> {
  const existing = await getLevelProgressRecord(userId, lang, level);
  if (existing) return existing;

  const record: LevelProgress = {
    id: makeLevelKey(userId, lang, level),
    userId,
    languageCode: lang,
    levelId: level,
    completedLessons: [],
    totalLessons: 0,
    completed: false,
  };

  try {
    await dbPut(STORES.levelProgress, record);
  } catch {
    // Ignore save errors
  }

  return record;
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
    const lessonKey = `${sectionId}/${lessonId}`;
    const progress = await getOrCreateLevelProgress(userId, languageCode, levelId);

    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
    }

    await dbPut(STORES.levelProgress, progress);

    const user = await getOrCreateUser(userId);
    updateStreak(user);
    await dbPut(STORES.users, user);
  } catch (error) {
    console.warn('Failed to mark lesson complete:', error);
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
    const progress = await getLevelProgressRecord(userId, languageCode, levelId);
    if (!progress) return null;

    const lessonKey = `${sectionId}/${lessonId}`;
    return { completed: progress.completedLessons.includes(lessonKey) };
  } catch {
    return null;
  }
}

export async function getSectionProgress(
  userId: string,
  languageCode: string,
  levelId: string,
  sectionId: string
): Promise<{ completedLessons: number; percentComplete: number } | null> {
  if (isServer()) return null;

  try {
    const progress = await getLevelProgressRecord(userId, languageCode, levelId);
    if (!progress) return null;

    const sectionLessons = progress.completedLessons.filter(
      (key) => key.startsWith(`${sectionId}/`)
    );

    return {
      completedLessons: sectionLessons.length,
      percentComplete: progress.totalLessons > 0
        ? (sectionLessons.length / progress.totalLessons) * 100
        : 0,
    };
  } catch {
    return null;
  }
}

export async function getCompletionPercentage(
  userId: string,
  languageCode: string,
  levelId: string
): Promise<number> {
  if (isServer()) return 0;

  try {
    const progress = await getLevelProgressRecord(userId, languageCode, levelId);
    if (!progress || progress.totalLessons === 0) return 0;

    return (progress.completedLessons.length / progress.totalLessons) * 100;
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
    const storeNames = [STORES.users, STORES.userLanguages, STORES.levelProgress, STORES.sessions];
    const tx = db.transaction(storeNames, 'readwrite');

    tx.objectStore(STORES.users).delete(userId);

    // Delete all records for this user from each store with userId index
    for (const storeName of [STORES.userLanguages, STORES.levelProgress, STORES.sessions]) {
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
