'use client';

/**
 * Voice Selector Component
 * Allows users to select their preferred TTS voice
 */

import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  language?: string; // Filter voices by language (e.g., 'en', 'de', 'fr')
  className?: string;
}

export function VoiceSelector({
  availableVoices,
  selectedVoice,
  onVoiceChange,
  language,
  className = '',
}: VoiceSelectorProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Filter voices by language if specified
  const filteredVoices = language
    ? availableVoices.filter(voice =>
        voice.lang.toLowerCase().startsWith(language.toLowerCase())
      )
    : availableVoices;

  // Group voices by language
  const groupedVoices = filteredVoices.reduce((groups, voice) => {
    const lang = voice.lang;
    if (!groups[lang]) {
      groups[lang] = [];
    }
    groups[lang].push(voice);
    return groups;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  const handleVoiceSelect = (voice: SpeechSynthesisVoice) => {
    onVoiceChange(voice);
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
        title="Select voice"
        aria-label="Select voice"
        aria-expanded={showMenu}
      >
        <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
          {selectedVoice ? selectedVoice.name : 'Default'}
        </span>
      </button>

      {/* Voice menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[250px] max-h-[300px] overflow-y-auto">
            {filteredVoices.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No voices available
              </div>
            ) : (
              Object.entries(groupedVoices).map(([lang, voices]) => (
                <div key={lang}>
                  {/* Language header */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                    {lang}
                  </div>

                  {/* Voices */}
                  {voices.map((voice, index) => (
                    <button
                      key={`${voice.name}-${index}`}
                      onClick={() => handleVoiceSelect(voice)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedVoice?.name === voice.name
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{voice.name}</span>
                        {voice.localService && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                            Local
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
