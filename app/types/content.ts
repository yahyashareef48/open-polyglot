/**
 * Type definitions for Open Polyglot content structure
 *
 * These types match the JSON schemas used for storing language learning content
 * in the public/content directory.
 */

// ============================================================================
// Language Metadata Types
// ============================================================================

export interface LanguageLevel {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface LanguageMetadata {
  $schema: string;
  code: string;
  name: string;
  nativeName: string;
  description: string;
  flagEmoji: string;
  availableLevels: LanguageLevel[];
  themeColors: ThemeColors;
  contributors: string[];
  version: string;
  lastUpdated: string;
}

// ============================================================================
// Level Metadata Types
// ============================================================================

export interface SectionInfo {
  id: string;
  title: string;
  description: string;
  order: number;
  lessonsCount: number;
  enabled: boolean;
}

export interface LevelMetadata {
  $schema: string;
  id: string;
  name: string;
  cefr: string;
  description: string;
  estimatedHours: number;
  sections: SectionInfo[];
  objectives: string[];
  version: string;
  lastUpdated: string;
}

// ============================================================================
// Section Metadata Types
// ============================================================================

export type LessonType = 'informational' | 'vocabulary' | 'grammar' | 'dialogue' | 'practice' | 'quiz';

export interface LessonInfo {
  id: string;
  title: string;
  description: string;
  order: number;
  type: LessonType;
  estimatedMinutes: number;
  hasQuiz: boolean;
  hasExercises: boolean;
}

export interface SectionMetadata {
  $schema: string;
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonInfo[];
  version: string;
  lastUpdated: string;
}

// ============================================================================
// Lesson Content Types
// ============================================================================

export type ContentSectionType = 'text' | 'vocabulary' | 'grammar' | 'dialogue' | 'audio' | 'video';

export interface ContentSection {
  type: ContentSectionType;
  content: string; // Markdown or structured content
  audioUrl?: string;
  videoUrl?: string;
}

export interface LessonMetadata {
  lessonNumber: number;
  sectionId: string;
  levelId: string;
  languageCode: string;
  version: string;
  lastUpdated: string;
}

// ============================================================================
// Audio Playback Types
// ============================================================================

export interface AudioTimestamp {
  start: number; // Start time in seconds
  end: number; // End time in seconds
  sectionIndex: number; // Which section to highlight
  sentenceIndex?: number; // Optional sentence-level granularity
  text?: string; // Optional text snippet for debugging
}

export interface LessonAudio {
  enabled: boolean;
  url?: string; // Optional pre-recorded audio URL
  useTTS: boolean; // Whether to use text-to-speech
  language?: string; // Language code for TTS (e.g., 'de-DE', 'fr-FR')
  voice?: string; // Specific voice name for TTS
  timestamps?: AudioTimestamp[]; // Timestamp mappings for text sync
}

export interface LessonContent {
  $schema: string;
  id: string;
  title: string;
  type: LessonType;
  sections: ContentSection[];
  metadata: LessonMetadata;
  audio?: LessonAudio; // Optional audio playback configuration
}

// ============================================================================
// Quiz Types
// ============================================================================

export type QuestionType = 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'matching';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  correctAnswer: string | string[]; // Can be single ID or multiple IDs for matching
  explanation?: string;
  points: number;
}

export interface Quiz {
  $schema: string;
  lessonId: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage needed to pass
  version: string;
}

// ============================================================================
// Exercise Types
// ============================================================================

export type ExerciseType = 'fill-in-blank' | 'matching' | 'translation' | 'rearrange' | 'speaking';

export interface ExerciseItem {
  id: string;
  instruction: string;
  prompt: string;
  answer: string | string[];
  hint?: string;
  audioUrl?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instructions: string;
  items: ExerciseItem[];
}

export interface Exercises {
  $schema: string;
  lessonId: string;
  exercises: Exercise[];
  version: string;
}

// ============================================================================
// Speaking & Pronunciation Types
// ============================================================================

export interface PronunciationTip {
  character: string;
  sound: string;
  example: string;
  tip: string;
}

export interface SpeakingExercise {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string; // IPA or simplified pronunciation
  audioUrl?: string;
  tips: PronunciationTip[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ============================================================================
// Vocabulary Game Types
// ============================================================================

export type VocabularyGameType = 'wordle' | 'flashcards' | 'matching' | 'memory';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  audioUrl?: string;
  exampleSentence?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface VocabularyGame {
  $schema: string;
  type: VocabularyGameType;
  name: string;
  description: string;
  words: VocabularyWord[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  version: string;
}

// ============================================================================
// Progress Tracking Types (IndexedDB stores)
// ============================================================================

// Store: users (key: userId)
export interface User {
  userId: string;
  createdAt: string;
  lastActive: string;
  streak: number;
  totalTimeSpent: number;
  lastOpened?: Record<string, string>; // { [lang]: "level:section:lesson" }
}

// Store: lessons (key: userId:languageCode:levelId:sectionId:lessonId)
export interface Lesson {
  id: string; // userId:languageCode:levelId:sectionId:lessonId
  lessonId: string;
  sectionId: string;
  levelId: string;
  languageCode: string;
  userId: string;
  completed: boolean;
  completedAt: string;
}

// Store: sessions (for analytics/AI)
export interface Session {
  id: string;
  userId: string;
  languageCode: string;
  duration: number; // minutes
  activityType: 'lesson' | 'quiz' | 'practice' | 'review';
  timestamp: string;
}

// ============================================================================
// API/Utility Types
// ============================================================================

export interface ContentPath {
  language: string;
  level: string;
  section: string;
  lesson: string;
}

export interface NavigationInfo {
  previous?: {
    id: string;
    title: string;
    url: string;
  };
  next?: {
    id: string;
    title: string;
    url: string;
  };
  parent: {
    type: 'section' | 'level' | 'language';
    title: string;
    url: string;
  };
}

export interface BreadcrumbItem {
  label: string;
  url: string;
  active: boolean;
}
