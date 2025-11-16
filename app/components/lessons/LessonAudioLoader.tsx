'use client';

/**
 * Lesson Audio Loader
 * Client component that loads lesson content into the audio player context
 */

import { useEffect } from 'react';
import { useAudioPlayer } from '@/app/contexts/AudioPlayerContext';
import type { LessonContent } from '@/app/types/content';

interface LessonAudioLoaderProps {
  lessonContent: LessonContent;
}

export default function LessonAudioLoader({ lessonContent }: LessonAudioLoaderProps) {
  const audioPlayer = useAudioPlayer();

  useEffect(() => {
    // Load lesson content into audio player
    audioPlayer.loadLesson(lessonContent);

    // Cleanup on unmount
    return () => {
      audioPlayer.clearLesson();
    };
  }, [lessonContent.id]); // Only reload if lesson ID changes

  // This component doesn't render anything
  return null;
}
