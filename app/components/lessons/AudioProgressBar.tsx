'use client';

/**
 * Audio Progress Bar Component
 * Displays playback progress with seekable timeline
 */

import React, { useRef, useState, useCallback } from 'react';

interface AudioProgressBarProps {
  currentTime: number;
  totalDuration: number;
  onSeek?: (time: number) => void;
  className?: string;
}

export function AudioProgressBar({
  currentTime,
  totalDuration,
  onSeek,
  className = '',
}: AudioProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  // Calculate progress percentage
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle seek
  const handleSeek = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !onSeek) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const time = (percentage / 100) * totalDuration;

    onSeek(time);
  }, [totalDuration, onSeek]);

  // Handle mouse down (start dragging)
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(event);
  }, [handleSeek]);

  // Handle mouse move (during drag or hover)
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const time = (percentage / 100) * totalDuration;
    setHoverTime(time);

    if (isDragging) {
      handleSeek(event);
    }
  }, [totalDuration, isDragging, handleSeek]);

  // Handle mouse up (end dragging)
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoverTime(null);
  }, []);

  // Add global mouse up listener when dragging
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />

        {/* Hover indicator */}
        {hoverTime !== null && (
          <div
            className="absolute top-0 h-full w-1 bg-white/50 pointer-events-none"
            style={{ left: `${(hoverTime / totalDuration) * 100}%` }}
          />
        )}

        {/* Progress knob */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-300 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
        <span>{formatTime(currentTime)}</span>
        {hoverTime !== null && (
          <span className="text-emerald-600 dark:text-emerald-400">
            {formatTime(hoverTime)}
          </span>
        )}
        <span>{formatTime(totalDuration)}</span>
      </div>
    </div>
  );
}
