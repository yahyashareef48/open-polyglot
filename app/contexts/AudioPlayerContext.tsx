"use client";

/**
 * Audio Player Context
 * Manages audio playback state for lesson content with TTS support
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useTextToSpeech, type TTSSection } from "@/app/hooks/useTextToSpeech";
import type { LessonContent, ContentSection, AudioTimestamp } from "@/app/types/content";

// ============================================================================
// Types
// ============================================================================

export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface AudioPlayerState {
  // Lesson content
  lessonContent: LessonContent | null;

  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  playbackSpeed: PlaybackSpeed;
  currentTime: number;
  totalDuration: number;

  // UI state
  isMinimized: boolean;
  isLoading: boolean;

  // Audio metadata
  timestamps: AudioTimestamp[];

  // Voice selection
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;

  // Browser support
  isSupported: boolean;
}

export interface AudioPlayerActions {
  // Lesson management
  loadLesson: (lesson: LessonContent) => void;
  clearLesson: () => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  seek: (time: number) => void;

  // Voice controls
  setVoice: (voice: SpeechSynthesisVoice) => void;

  // UI controls
  toggleMinimize: () => void;
  setMinimized: (minimized: boolean) => void;
}

export type AudioPlayerContextType = AudioPlayerState & AudioPlayerActions;

// ============================================================================
// Context
// ============================================================================

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  // TTS hook
  const tts = useTextToSpeech();

  // State
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Load saved voice preference on mount
  useEffect(() => {
    if (tts.availableVoices.length > 0 && !selectedVoice) {
      const savedVoiceName = localStorage.getItem("preferred-voice");
      if (savedVoiceName) {
        const voice = tts.availableVoices.find((v) => v.name === savedVoiceName);
        if (voice) {
          setSelectedVoice(voice);
        }
      }
    }
  }, [tts.availableVoices, selectedVoice]);

  // Persist playback position in localStorage
  useEffect(() => {
    if (lessonContent && tts.currentTime > 0) {
      const key = `audio-position-${lessonContent.id}`;
      localStorage.setItem(key, tts.currentTime.toString());
    }
  }, [lessonContent, tts.currentTime]);

  // Extract text sections from lesson content for TTS
  const extractTextSections = useCallback((lesson: LessonContent): TTSSection[] => {
    return lesson.sections.map((section, index) => ({
      text: stripMarkdown(section.content),
      sectionIndex: index,
    }));
  }, []);

  // Load lesson and prepare audio
  const loadLesson = useCallback((lesson: LessonContent) => {
    setLessonContent(lesson);
    setIsLoading(false);

    // Check if lesson has audio configuration
    if (lesson.audio?.enabled) {
      console.log("Audio enabled for lesson:", lesson.id);

      // Load saved playback position
      const key = `audio-position-${lesson.id}`;
      const savedPosition = localStorage.getItem(key);
      if (savedPosition) {
        console.log("Saved position found:", savedPosition);
      }
    }
  }, []);

  // Clear lesson
  const clearLesson = useCallback(() => {
    tts.stop();
    setLessonContent(null);
  }, [tts]);

  // Play
  const play = useCallback(() => {
    if (!lessonContent) return;

    setIsLoading(true);

    try {
      const sections = extractTextSections(lessonContent);

      // Get language code from lesson metadata
      const languageCode = lessonContent.metadata.languageCode;
      const languageMap: Record<string, string> = {
        de: "de-DE",
        fr: "fr-FR",
        es: "es-ES",
        en: "en-US",
      };

      const language = lessonContent.audio?.language ?? languageMap[languageCode] ?? "en-US";

      // Use selected voice if available, otherwise use lesson config or auto-select
      const voiceName = selectedVoice?.name ?? lessonContent.audio?.voice;

      tts.speak(sections, {
        language,
        rate: playbackSpeed,
        voice: voiceName,
      });
    } catch (error) {
      console.error("Error starting playback:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lessonContent, extractTextSections, tts, playbackSpeed, selectedVoice]);

  // Pause
  const pause = useCallback(() => {
    tts.pause();
  }, [tts]);

  // Resume (used internally)
  const resume = useCallback(() => {
    tts.resume();
  }, [tts]);

  // Stop
  const stop = useCallback(() => {
    tts.stop();
  }, [tts]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!lessonContent?.audio?.enabled) return;

    if (tts.isSpeaking) {
      if (tts.isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      play();
    }
  }, [lessonContent, tts.isSpeaking, tts.isPaused, play, pause, resume]);

  // Skip forward
  const skipForward = useCallback((seconds?: number) => {
    const skipAmount = seconds ?? 10;
    // eslint-disable-next-line no-console
    console.log("[AudioPlayer] skipForward called", {
      seconds: skipAmount,
      currentTime: tts.currentTime,
      totalDuration: tts.totalDuration,
      isSpeaking: tts.isSpeaking,
      isPaused: tts.isPaused,
      timestampsCount: tts.timestamps.length
    });
    // TODO: Implement section-based skipping
  }, [tts.currentTime, tts.totalDuration, tts.isSpeaking, tts.isPaused, tts.timestamps]);

  // Skip backward
  const skipBackward = useCallback((seconds?: number) => {
    const skipAmount = seconds ?? 10;
    // eslint-disable-next-line no-console
    console.log("[AudioPlayer] skipBackward called", {
      seconds: skipAmount,
      currentTime: tts.currentTime,
      totalDuration: tts.totalDuration,
      isSpeaking: tts.isSpeaking,
      isPaused: tts.isPaused,
      timestampsCount: tts.timestamps.length
    });
    // TODO: Implement section-based skipping
  }, [tts.currentTime, tts.totalDuration, tts.isSpeaking, tts.isPaused, tts.timestamps]);

  // Set playback speed
  const setPlaybackSpeed = useCallback(
    (speed: PlaybackSpeed) => {
      setPlaybackSpeedState(speed);
      tts.setRate(speed);
    },
    [tts]
  );

  // Seek to specific time
  const seek = useCallback((time: number) => {
    console.log("Seek to:", time, "seconds");
    // TODO: Implement timestamp-based seeking
  }, []);

  // Toggle minimize
  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Set minimized state
  const setMinimized = useCallback((minimized: boolean) => {
    setIsMinimized(minimized);
  }, []);

  // Set voice
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    // Persist voice preference
    localStorage.setItem("preferred-voice", voice.name);
  }, []);

  // Context value
  const value: AudioPlayerContextType = {
    // State
    lessonContent,
    isPlaying: tts.isSpeaking,
    isPaused: tts.isPaused,
    playbackSpeed,
    currentTime: tts.currentTime,
    totalDuration: tts.totalDuration,
    isMinimized,
    isLoading,
    timestamps: tts.timestamps,
    availableVoices: tts.availableVoices,
    selectedVoice,
    isSupported: tts.isSupported,

    // Actions
    loadLesson,
    clearLesson,
    play,
    pause,
    stop,
    togglePlayPause,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
    seek,
    setVoice,
    toggleMinimize,
    setMinimized,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAudioPlayer(): AudioPlayerContextType {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Strip markdown formatting from text
 * Simple implementation for TTS - removes common markdown syntax and emojis
 */
function stripMarkdown(text: string): string {
  return (
    text
      // Remove headers
      .replace(/#{1,6}\s+/g, "")
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove blockquotes
      .replace(/^\s*>\s+/gm, "")
      // Remove horizontal rules
      .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "")
      // Remove list markers
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // Remove emojis (comprehensive emoji regex)
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols and Pictographs
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "") // Chess Symbols
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
      .replace(/[\u{2300}-\u{23FF}]/gu, "") // Miscellaneous Technical
      .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // Variation Selectors
      .replace(/[\u{1F004}]/gu, "") // Mahjong Tile Red Dragon
      .replace(/[\u{1F0CF}]/gu, "") // Playing Card Black Joker
      // Remove zero-width joiners and variation selectors that remain
      .replace(/[\u200D\uFE0F]/gu, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}
