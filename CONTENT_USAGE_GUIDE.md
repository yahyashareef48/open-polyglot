# Content Usage Guide - Open Polyglot

This guide explains how to use the content loading and progress tracking utilities in your Open Polyglot application code.

## Table of Contents

1. [Loading Content](#loading-content)
2. [Navigating Between Lessons](#navigating-between-lessons)
3. [Tracking User Progress](#tracking-user-progress)
4. [Implementing Quizzes](#implementing-quizzes)
5. [Code Examples](#code-examples)

---

## Loading Content

### Import the Content Utilities

```typescript
import {
  getLanguageMetadata,
  getLevelMetadata,
  getSectionMetadata,
  getLessonContent,
  getNavigationInfo,
  getBreadcrumbs,
} from '@/lib/content';
```

### Loading a Specific Lesson

```typescript
// In a Server Component (Next.js 14)
export default async function LessonPage({ params }: { params: { lang: string; level: string; section: string; lesson: string } }) {
  const { lang, level, section, lesson } = await params;

  // Load the lesson content
  const lessonContent = await getLessonContent(lang, level, section, lesson);

  // Load navigation info
  const navigationInfo = await getNavigationInfo(lang, level, section, lesson);

  return (
    <div>
      <h1>{lessonContent.title}</h1>
      <LessonContent content={lessonContent} />
      <LessonNavigation navigationInfo={navigationInfo} />
    </div>
  );
}
```

### Loading All Lessons in a Section

```typescript
import { getLessonsForSection } from '@/lib/content';

const lessons = await getLessonsForSection('german', 'a1', 'intro');

lessons.forEach(lesson => {
  console.log(lesson.title);
});
```

### Loading Language Metadata

```typescript
const languageMetadata = await getLanguageMetadata('german');

console.log(languageMetadata.name); // "German"
console.log(languageMetadata.availableLevels); // Array of levels
```

---

## Navigating Between Lessons

### Using Navigation Info

The `getNavigationInfo` function provides previous/next lesson information:

```typescript
const navigationInfo = await getNavigationInfo('german', 'a1', 'intro', '01-welcome');

// Access previous lesson
if (navigationInfo.previous) {
  console.log(navigationInfo.previous.title);
  console.log(navigationInfo.previous.url); // /languages/german/a1/intro/previous-lesson-id
}

// Access next lesson
if (navigationInfo.next) {
  console.log(navigationInfo.next.title);
  console.log(navigationInfo.next.url); // /languages/german/a1/intro/next-lesson-id
}

// Access parent section
console.log(navigationInfo.parent.title);
console.log(navigationInfo.parent.url); // /languages/german/a1/intro
```

### Creating Breadcrumbs

```typescript
const breadcrumbs = await getBreadcrumbs({
  language: 'german',
  level: 'a1',
  section: 'intro',
  lesson: '01-welcome',
});

breadcrumbs.forEach(crumb => {
  console.log(`${crumb.label} -> ${crumb.url}`);
});
// Output:
// Home -> /
// German -> /languages/german
// A1 - Beginner -> /languages/german/a1
// Introduction -> /languages/german/a1/intro
// Welcome to Open Polyglot -> /languages/german/a1/intro/01-welcome
```

---

## Tracking User Progress

### Import Progress Utilities

```typescript
import {
  getOrCreateProgress,
  markLessonComplete,
  getLessonProgress,
  isLessonCompleted,
  getCurrentLesson,
  getCompletionPercentage,
  getStatistics,
} from '@/lib/progress';
```

### Initializing Progress for a User

```typescript
// Get or create progress for a user
const userId = 'user-123';
const languageCode = 'german';

const userProgress = await getOrCreateProgress(userId, languageCode);
console.log(userProgress.currentLevel); // 'a1'
console.log(userProgress.streak); // 0 (initially)
```

### Marking a Lesson as Complete

```typescript
// Client-side component example
'use client';

import { markLessonComplete } from '@/lib/progress';
import { useState } from 'react';

function CompleteButton() {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      await markLessonComplete(
        'user-123',      // userId
        'german',        // languageCode
        'a1',            // levelId
        'intro',         // sectionId
        '01-welcome',    // lessonId
        100,             // score (optional)
        15               // timeSpent in minutes (optional)
      );

      alert('Lesson completed!');
      window.location.reload(); // Refresh to show updated progress
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <button onClick={handleComplete} disabled={isCompleting}>
      {isCompleting ? 'Saving...' : 'Mark as Complete'}
    </button>
  );
}
```

### Checking if a Lesson is Completed

```typescript
const isCompleted = await isLessonCompleted(
  'user-123',
  'german',
  'a1',
  'intro',
  '01-welcome'
);

if (isCompleted) {
  console.log('✓ Lesson already completed');
}
```

### Getting Current Lesson

```typescript
const currentLesson = await getCurrentLesson('user-123', 'german');

if (currentLesson) {
  console.log(`Current: ${currentLesson.levelId}/${currentLesson.sectionId}/${currentLesson.lessonId}`);
}
```

### Getting User Statistics

```typescript
const stats = await getStatistics('user-123', 'german');

console.log(`Lessons completed: ${stats.totalLessonsCompleted}`);
console.log(`Time spent: ${stats.totalTimeSpent} minutes`);
console.log(`Current streak: ${stats.currentStreak} days`);
console.log(`Overall progress: ${stats.overallProgress}%`);
```

### Getting Completion Percentage for a Level

```typescript
const percentage = await getCompletionPercentage('user-123', 'german', 'a1');

console.log(`A1 Level: ${percentage}% complete`);
```

---

## Implementing Quizzes

### Loading a Quiz

```typescript
import { getQuiz } from '@/lib/content';

const quiz = await getQuiz('german', 'a1', 'intro', '01-welcome');

if (quiz) {
  console.log(`Quiz has ${quiz.questions.length} questions`);
  console.log(`Passing score: ${quiz.passingScore}%`);

  quiz.questions.forEach(question => {
    console.log(question.question);
    console.log(question.options);
  });
}
```

### Quiz Component Example

```typescript
'use client';

import { useState } from 'react';
import { Quiz } from '@/app/types/content';

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;

    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / quiz.questions.length) * 100;
    setScore(percentage);
  };

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div>
      {score === null ? (
        <>
          <h3>Question {currentQuestion + 1} of {quiz.questions.length}</h3>
          <p>{currentQ.question}</p>

          {currentQ.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswer(currentQ.id, option.id)}
              className={selectedAnswers[currentQ.id] === option.id ? 'selected' : ''}
            >
              {option.text}
            </button>
          ))}

          {currentQuestion < quiz.questions.length - 1 ? (
            <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next Question
            </button>
          ) : (
            <button onClick={handleSubmit}>Submit Quiz</button>
          )}
        </>
      ) : (
        <div>
          <h3>Quiz Complete!</h3>
          <p>Your score: {score}%</p>
          {score >= quiz.passingScore ? (
            <p>✓ Passed!</p>
          ) : (
            <p>Try again to pass (need {quiz.passingScore}%)</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Code Examples

### Example 1: Lesson Page with Progress Tracking

```typescript
// app/languages/[lang]/[level]/[section]/[lesson]/page.tsx
import { getLessonContent, getNavigationInfo } from '@/lib/content';
import { getLessonProgress } from '@/lib/progress';
import LessonContent from '@/app/components/lessons/LessonContent';
import LessonNavigation from '@/app/components/lessons/LessonNavigation';
import MarkCompleteButton from '@/app/components/lessons/MarkCompleteButton';

export default async function LessonPage({ params }) {
  const { lang, level, section, lesson } = await params;

  const lessonContent = await getLessonContent(lang, level, section, lesson);
  const navigationInfo = await getNavigationInfo(lang, level, section, lesson);

  // Get user ID from auth context (placeholder)
  const userId = 'guest';
  const lessonProgress = await getLessonProgress(userId, lang, level, section, lesson);

  const isCompleted = lessonProgress?.completed ?? false;

  return (
    <div>
      <h1>{lessonContent.title}</h1>
      {isCompleted && <div>✓ Completed</div>}

      <LessonContent content={lessonContent} />

      {!isCompleted && (
        <MarkCompleteButton
          userId={userId}
          languageCode={lang}
          levelId={level}
          sectionId={section}
          lessonId={lesson}
        />
      )}

      <LessonNavigation navigationInfo={navigationInfo} />
    </div>
  );
}
```

### Example 2: Section Overview with Progress

```typescript
// app/languages/[lang]/[level]/[section]/page.tsx
import { getSectionMetadata, getSectionProgress } from '@/lib/content';
import Link from 'next/link';

export default async function SectionPage({ params }) {
  const { lang, level, section } = await params;

  const sectionMeta = await getSectionMetadata(lang, level, section);
  const userId = 'guest';
  const sectionProgress = await getSectionProgress(userId, lang, level, section);

  return (
    <div>
      <h1>{sectionMeta.title}</h1>
      <p>{sectionMeta.description}</p>

      {sectionProgress && (
        <div>
          Progress: {sectionProgress.completedLessons} / {sectionProgress.totalLessons} lessons
          ({sectionProgress.percentComplete.toFixed(0)}%)
        </div>
      )}

      <ul>
        {sectionMeta.lessons.map(lesson => {
          const isCompleted = sectionProgress?.lessons.find(l => l.lessonId === lesson.id)?.completed ?? false;

          return (
            <li key={lesson.id}>
              <Link href={`/languages/${lang}/${level}/${section}/${lesson.id}`}>
                {isCompleted && '✓ '}
                {lesson.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

### Example 3: User Dashboard with Statistics

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getStatistics, getCurrentLesson } from '@/lib/progress';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const userId = 'guest'; // Get from auth
      const statsData = await getStatistics(userId, 'german');
      const currentData = await getCurrentLesson(userId, 'german');

      setStats(statsData);
      setCurrentLesson(currentData);
    };

    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Progress</h1>

      <div>
        <h2>Statistics</h2>
        <p>Lessons completed: {stats.totalLessonsCompleted}</p>
        <p>Time spent: {stats.totalTimeSpent} minutes</p>
        <p>Current streak: {stats.currentStreak} days</p>
        <p>Overall progress: {stats.overallProgress.toFixed(1)}%</p>
      </div>

      {currentLesson && (
        <div>
          <h2>Continue Learning</h2>
          <a href={`/languages/german/${currentLesson.levelId}/${currentLesson.sectionId}/${currentLesson.lessonId}`}>
            Continue to current lesson →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

1. **Error Handling**: Always wrap content loading in try-catch blocks to handle missing content gracefully.

2. **User ID Management**: Replace hardcoded `'guest'` userId with actual user authentication.

3. **Performance**: Use Next.js caching strategies for content that doesn't change often.

4. **Progress Updates**: Call `markLessonComplete` only once per lesson to avoid duplicate entries.

5. **Client vs Server**: Use Server Components for loading content, Client Components for interactive progress tracking.

6. **Type Safety**: Always import and use TypeScript types from `@/app/types/content`.

---

## Troubleshooting

### Content Not Loading

```typescript
try {
  const content = await getLessonContent('german', 'a1', 'intro', '01-welcome');
} catch (error) {
  console.error('Failed to load content:', error);
  // Show error message to user
}
```

### Progress Not Saving

Check browser console for IndexedDB errors. The system will automatically fall back to localStorage if IndexedDB is unavailable.

### JSON Parsing Errors

Validate your JSON files:
```bash
# Using Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('path/to/file.json', 'utf8')))"
```

---

## Additional Resources

- [TypeScript Type Definitions](app/types/content.ts)
- [Content Loading Utilities](lib/content.ts)
- [Progress Tracking Utilities](lib/progress.ts)
- [Content Structure Documentation](public/content/README.md)

---

**Happy Coding! 🦉**
