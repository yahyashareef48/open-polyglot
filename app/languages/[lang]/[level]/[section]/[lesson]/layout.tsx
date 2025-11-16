'use client';

/**
 * Lesson Layout
 * Wraps lesson pages with AudioPlayerProvider and renders the AudioPlayer component
 */

import { AudioPlayerProvider } from '@/app/contexts/AudioPlayerContext';
import { AudioPlayer, useAudioPlayerKeyboardShortcuts } from '@/app/components/lessons/AudioPlayer';
import { ReactNode, useEffect } from 'react';

interface LessonLayoutProps {
  children: ReactNode;
}

// Inner component that uses the audio player hook
function LessonLayoutInner({ children }: LessonLayoutProps) {
  // Enable keyboard shortcuts
  useAudioPlayerKeyboardShortcuts();

  return (
    <>
      {children}
      <AudioPlayer />
    </>
  );
}

export default function LessonLayout({ children }: LessonLayoutProps) {
  return (
    <AudioPlayerProvider>
      <LessonLayoutInner>{children}</LessonLayoutInner>
    </AudioPlayerProvider>
  );
}
