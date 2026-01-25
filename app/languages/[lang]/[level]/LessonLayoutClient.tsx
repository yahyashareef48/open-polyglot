'use client';

/**
 * Client wrapper for the lesson layout
 * Provides AudioPlayerProvider and keyboard shortcuts
 */

import { ReactNode } from 'react';
import { AudioPlayerProvider } from '@/app/contexts/AudioPlayerContext';
import { AudioPlayer, useAudioPlayerKeyboardShortcuts } from '@/app/components/lessons/AudioPlayer';

interface LessonLayoutClientProps {
  children: ReactNode;
}

function LessonLayoutInner({ children }: LessonLayoutClientProps) {
  useAudioPlayerKeyboardShortcuts();

  return (
    <>
      {children}
      <AudioPlayer />
    </>
  );
}

export default function LessonLayoutClient({ children }: LessonLayoutClientProps) {
  return (
    <AudioPlayerProvider>
      <LessonLayoutInner>{children}</LessonLayoutInner>
    </AudioPlayerProvider>
  );
}
