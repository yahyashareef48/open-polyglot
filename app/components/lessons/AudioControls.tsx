'use client';

/**
 * Audio Controls Component
 * Provides playback control buttons (play, pause, skip, speed)
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Gauge,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import type { PlaybackSpeed } from '@/app/contexts/AudioPlayerContext';

interface AudioControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  playbackSpeed: PlaybackSpeed;
  isMinimized: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onSkipForward: (seconds?: number) => void;
  onSkipBackward: (seconds?: number) => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onToggleMinimize: () => void;
  className?: string;
}

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function AudioControls({
  isPlaying,
  isPaused,
  playbackSpeed,
  isMinimized,
  onPlayPause,
  onStop,
  onSkipForward,
  onSkipBackward,
  onSpeedChange,
  onToggleMinimize,
  className = '',
}: AudioControlsProps) {
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);

  const handleSpeedClick = () => {
    setShowSpeedMenu(prev => !prev);
  };

  const handleSpeedSelect = (speed: PlaybackSpeed) => {
    onSpeedChange(speed);
    setShowSpeedMenu(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Minimize/Maximize button */}
      <button
        onClick={onToggleMinimize}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={isMinimized ? 'Maximize' : 'Minimize'}
        aria-label={isMinimized ? 'Maximize player' : 'Minimize player'}
      >
        {isMinimized ? (
          <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {!isMinimized && (
        <>
          {/* Skip Backward */}
          <button
            onClick={() => onSkipBackward(10)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Skip backward 10s"
            aria-label="Skip backward 10 seconds"
            disabled={!isPlaying && !isPaused}
          >
            <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-105 shadow-lg"
            title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            aria-label={isPlaying && !isPaused ? 'Pause' : 'Play'}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-6 h-6 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white" />
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => onSkipForward(10)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Skip forward 10s"
            aria-label="Skip forward 10 seconds"
            disabled={!isPlaying && !isPaused}
          >
            <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Speed Control */}
          <div className="relative">
            <button
              onClick={handleSpeedClick}
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Playback speed"
              aria-label="Playback speed"
              aria-expanded={showSpeedMenu}
            >
              <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {playbackSpeed}x
              </span>
            </button>

            {/* Speed menu */}
            {showSpeedMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSpeedMenu(false)}
                />

                {/* Menu */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[100px]">
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedSelect(speed)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        speed === playbackSpeed
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Stop/Close button */}
      <button
        onClick={onStop}
        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors ml-auto"
        title="Stop and close"
        aria-label="Stop playback and close player"
      >
        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
}
