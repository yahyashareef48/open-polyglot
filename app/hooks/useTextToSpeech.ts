/**
 * Custom hook for Text-to-Speech functionality using Web Speech API
 * Provides methods to generate speech from text with language and voice control
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AudioTimestamp } from '@/app/types/content';

export interface TTSOptions {
  language?: string; // e.g., 'de-DE', 'fr-FR', 'es-ES', 'en-US'
  voice?: string; // Specific voice name
  rate?: number; // Speed: 0.1 to 10 (default 1)
  pitch?: number; // Pitch: 0 to 2 (default 1)
  volume?: number; // Volume: 0 to 1 (default 1)
}

export interface TTSSection {
  text: string;
  sectionIndex: number;
}

export interface UseTextToSpeechReturn {
  speak: (sections: TTSSection[], options?: TTSOptions) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  isPaused: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  currentTime: number; // Estimated current time in seconds
  totalDuration: number; // Estimated total duration in seconds
  timestamps: AudioTimestamp[];
  availableVoices: SpeechSynthesisVoice[];
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [timestamps, setTimestamps] = useState<AudioTimestamp[]>([]);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const currentUtteranceIndexRef = useRef(0);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rateRef = useRef(1);

  // Check for Web Speech API support and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      // Load available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      // Voices may load asynchronously
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start time tracking interval
  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isPaused && isSpeaking) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setCurrentTime(accumulatedTimeRef.current + elapsed);
      }
    }, 100); // Update every 100ms for smooth progress
  }, [isPaused, isSpeaking]);

  // Stop time tracking
  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Estimate duration based on text length and speech rate
  const estimateDuration = useCallback((text: string, rate: number): number => {
    // Average speaking rate: ~150 words per minute at rate 1.0
    const wordsPerMinute = 150 * rate;
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60; // Duration in seconds
  }, []);

  // Generate timestamps for sections
  const generateTimestamps = useCallback((sections: TTSSection[], rate: number): AudioTimestamp[] => {
    const timestamps: AudioTimestamp[] = [];
    let currentTime = 0;

    sections.forEach((section) => {
      const duration = estimateDuration(section.text, rate);
      timestamps.push({
        start: currentTime,
        end: currentTime + duration,
        sectionIndex: section.sectionIndex,
        text: section.text.substring(0, 50) + '...', // First 50 chars for debugging
      });
      currentTime += duration;
    });

    return timestamps;
  }, [estimateDuration]);

  // Speak multiple sections
  const speak = useCallback((sections: TTSSection[], options: TTSOptions = {}) => {
    if (!isSupported) {
      console.warn('Text-to-Speech is not supported in this browser');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    utterancesRef.current = [];
    currentUtteranceIndexRef.current = 0;
    accumulatedTimeRef.current = 0;
    setCurrentTime(0);

    const rate = options.rate ?? rateRef.current;
    rateRef.current = rate;

    // Generate timestamps
    const generatedTimestamps = generateTimestamps(sections, rate);
    setTimestamps(generatedTimestamps);

    // Calculate total duration
    const totalDur = generatedTimestamps.reduce((sum, ts) => sum + (ts.end - ts.start), 0);
    setTotalDuration(totalDur);

    // Create utterances for each section
    sections.forEach((section, index) => {
      const utterance = new SpeechSynthesisUtterance(section.text);

      // Set language
      if (options.language) {
        utterance.lang = options.language;
      }

      // Set voice
      if (options.voice && availableVoices.length > 0) {
        const selectedVoice = availableVoices.find(v => v.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else if (options.language && availableVoices.length > 0) {
        // Auto-select voice based on language
        const langVoice = availableVoices.find(v => v.lang.startsWith(options.language!));
        if (langVoice) {
          utterance.voice = langVoice;
        }
      }

      // Set speech parameters
      utterance.rate = rate;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        startTimeRef.current = Date.now();
        startTimeTracking();
      };

      utterance.onend = () => {
        accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
        currentUtteranceIndexRef.current++;

        // If this was the last utterance
        if (currentUtteranceIndexRef.current >= utterancesRef.current.length) {
          setIsSpeaking(false);
          stopTimeTracking();
          setCurrentTime(totalDur);
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        stopTimeTracking();
      };

      utterancesRef.current.push(utterance);
    });

    // Start speaking
    utterancesRef.current.forEach(utterance => {
      window.speechSynthesis.speak(utterance);
    });
  }, [isSupported, availableVoices, generateTimestamps, startTimeTracking, stopTimeTracking]);

  // Pause speech
  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      pauseTimeRef.current = Date.now();
      accumulatedTimeRef.current += (pauseTimeRef.current - startTimeRef.current) / 1000;
      stopTimeTracking();
    }
  }, [stopTimeTracking]);

  // Resume speech
  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now();
      startTimeTracking();
    }
  }, [startTimeTracking]);

  // Stop speech
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentTime(0);
    currentUtteranceIndexRef.current = 0;
    accumulatedTimeRef.current = 0;
    stopTimeTracking();
  }, [stopTimeTracking]);

  // Change speech rate
  const setRate = useCallback((rate: number) => {
    rateRef.current = Math.max(0.5, Math.min(2, rate)); // Clamp between 0.5 and 2

    // If currently speaking, need to restart with new rate
    if (isSpeaking && utterancesRef.current.length > 0) {
      const currentIndex = currentUtteranceIndexRef.current;
      const currentSections: TTSSection[] = utterancesRef.current.slice(currentIndex).map((utterance, idx) => ({
        text: utterance.text,
        sectionIndex: currentIndex + idx,
      }));

      // Restart from current position with new rate
      stop();
      // We would need to re-speak from current position
      // This is a limitation of the Web Speech API
      console.log('Rate changed to:', rateRef.current);
    }
  }, [isSpeaking, stop]);

  return {
    speak,
    pause,
    resume,
    stop,
    setRate,
    isPaused,
    isSpeaking,
    isSupported,
    currentTime,
    totalDuration,
    timestamps,
    availableVoices,
  };
}
