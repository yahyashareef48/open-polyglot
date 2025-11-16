'use client';

/**
 * Audio Player Component
 * Sticky audio player that appears at bottom-right of screen
 * Supports play/pause, speed control, and text highlighting sync
 */

import React, { useEffect } from 'react';
import { useAudioPlayer } from '@/app/contexts/AudioPlayerContext';
import { AudioControls } from './AudioControls';
import { AudioProgressBar } from './AudioProgressBar';
import { VoiceSelector } from './VoiceSelector';
import { Volume2, Loader2 } from 'lucide-react';

export function AudioPlayer() {
  const audioPlayer = useAudioPlayer();

  // Don't render if no lesson is loaded or audio not enabled
  if (!audioPlayer.lessonContent?.audio?.enabled) {
    return null;
  }

  // Don't render if not supported
  if (!audioPlayer.isSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-sm">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 shadow-xl">
          <p className="text-sm text-red-600 dark:text-red-400">
            Audio playback is not supported in your browser.
          </p>
        </div>
      </div>
    );
  }

  const lesson = audioPlayer.lessonContent;

  return (
    <div
      className={`fixed z-40 transition-all duration-300 ${
        audioPlayer.isMinimized
          ? 'bottom-4 right-4 w-auto'
          : 'bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] sm:w-96'
      }`}
    >
      {/* Mobile: Full width at bottom */}
      <div
        className={`
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
          border border-gray-200 dark:border-gray-700
          shadow-2xl
          transition-all duration-300
          ${
            audioPlayer.isMinimized
              ? 'rounded-full px-4 py-3'
              : 'rounded-2xl p-4 sm:p-5'
          }
        `}
      >
        {audioPlayer.isMinimized ? (
          // Minimized view
          <div className="flex items-center gap-3">
            <div className="relative">
              {audioPlayer.isLoading ? (
                <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
              ) : (
                <Volume2
                  className={`w-5 h-5 ${
                    audioPlayer.isPlaying
                      ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                />
              )}
            </div>

            <AudioControls
              isPlaying={audioPlayer.isPlaying}
              isPaused={audioPlayer.isPaused}
              playbackSpeed={audioPlayer.playbackSpeed}
              isMinimized={audioPlayer.isMinimized}
              onPlayPause={audioPlayer.togglePlayPause}
              onStop={audioPlayer.stop}
              onSkipForward={audioPlayer.skipForward}
              onSkipBackward={audioPlayer.skipBackward}
              onSpeedChange={audioPlayer.setPlaybackSpeed}
              onToggleMinimize={audioPlayer.toggleMinimize}
            />
          </div>
        ) : (
          // Expanded view
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="relative mt-1">
                {audioPlayer.isLoading ? (
                  <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
                ) : (
                  <Volume2
                    className={`w-6 h-6 ${
                      audioPlayer.isPlaying
                        ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lesson Audio
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <AudioProgressBar
              currentTime={audioPlayer.currentTime}
              totalDuration={audioPlayer.totalDuration}
              onSeek={audioPlayer.seek}
            />

            {/* Voice Selector */}
            <VoiceSelector
              availableVoices={audioPlayer.availableVoices}
              selectedVoice={audioPlayer.selectedVoice}
              onVoiceChange={audioPlayer.setVoice}
              language={lesson.audio?.language?.split('-')[0]}
            />

            {/* Controls */}
            <AudioControls
              isPlaying={audioPlayer.isPlaying}
              isPaused={audioPlayer.isPaused}
              playbackSpeed={audioPlayer.playbackSpeed}
              isMinimized={audioPlayer.isMinimized}
              onPlayPause={audioPlayer.togglePlayPause}
              onStop={audioPlayer.stop}
              onSkipForward={audioPlayer.skipForward}
              onSkipBackward={audioPlayer.skipBackward}
              onSpeedChange={audioPlayer.setPlaybackSpeed}
              onToggleMinimize={audioPlayer.toggleMinimize}
            />

            {/* Current section indicator */}
            {audioPlayer.isPlaying && audioPlayer.currentSectionIndex >= 0 && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center animate-pulse">
                Reading section {audioPlayer.currentSectionIndex + 1} of{' '}
                {lesson.sections.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint (only show when expanded and not playing) */}
      {!audioPlayer.isMinimized && !audioPlayer.isPlaying && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Space to play/pause
        </div>
      )}
    </div>
  );
}

// Keyboard shortcuts hook
export function useAudioPlayerKeyboardShortcuts() {
  const audioPlayer = useAudioPlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if audio is enabled
      if (!audioPlayer.lessonContent?.audio?.enabled) return;

      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          audioPlayer.togglePlayPause();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          audioPlayer.skipBackward();
          break;
        case 'ArrowRight':
          event.preventDefault();
          audioPlayer.skipForward();
          break;
        case 'Escape':
          event.preventDefault();
          audioPlayer.stop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPlayer]);
}
