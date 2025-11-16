'use client';

/**
 * LessonContent Component
 *
 * Renders lesson content with support for markdown formatting.
 * Handles different content section types (text, vocabulary, grammar, etc.)
 * Supports audio playback text highlighting
 */

import { LessonContent as LessonContentType } from '@/app/types/content';
import { marked } from 'marked';
import { useAudioPlayer } from '@/app/contexts/AudioPlayerContext';
import { useEffect, useRef } from 'react';

interface LessonContentProps {
  content: LessonContentType;
}

export default function LessonContent({ content }: LessonContentProps) {
  const audioPlayer = useAudioPlayer();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to highlighted section
  useEffect(() => {
    if (audioPlayer.highlightedSectionIndex >= 0) {
      const sectionElement = sectionRefs.current[audioPlayer.highlightedSectionIndex];
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [audioPlayer.highlightedSectionIndex]);

  // Helper function to determine if section is highlighted
  const isHighlighted = (index: number) => {
    return audioPlayer.highlightedSectionIndex === index;
  };

  // Helper function to get highlight classes
  const getHighlightClasses = (index: number) => {
    if (isHighlighted(index)) {
      return 'ring-2 ring-amber-400 dark:ring-amber-500 bg-amber-50/50 dark:bg-amber-900/20 transition-all duration-300';
    }
    return 'transition-all duration-300';
  };

  return (
    <div className="lesson-content">
      {content.sections.map((section, index) => {
        switch (section.type) {
          case 'text':
            return (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className={`prose prose-gray dark:prose-invert max-w-none rounded-lg p-4 -m-4 ${getHighlightClasses(index)}`}
                dangerouslySetInnerHTML={{ __html: marked(section.content) }}
              />
            );

          case 'vocabulary':
            return (
              <div key={index} className="my-8" ref={(el) => (sectionRefs.current[index] = el)}>
                <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600 ${getHighlightClasses(index)}`}>
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                  />
                </div>
              </div>
            );

          case 'grammar':
            return (
              <div key={index} className="my-8" ref={(el) => (sectionRefs.current[index] = el)}>
                <div className={`bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-l-4 border-purple-600 ${getHighlightClasses(index)}`}>
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                  />
                </div>
              </div>
            );

          case 'dialogue':
            return (
              <div key={index} className="my-8" ref={(el) => (sectionRefs.current[index] = el)}>
                <div className={`bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-600 ${getHighlightClasses(index)}`}>
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                  />
                </div>
              </div>
            );

          case 'audio':
            return (
              <div key={index} className="my-8" ref={(el) => (sectionRefs.current[index] = el)}>
                <div className={`bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 ${getHighlightClasses(index)}`}>
                  {section.audioUrl && (
                    <audio controls className="w-full mb-4">
                      <source src={section.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {section.content && (
                    <div
                      className="prose prose-gray dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                    />
                  )}
                </div>
              </div>
            );

          case 'video':
            return (
              <div key={index} className="my-8" ref={(el) => (sectionRefs.current[index] = el)}>
                <div className={getHighlightClasses(index)}>
                  {section.videoUrl && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <iframe
                        src={section.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title="Lesson video"
                      />
                    </div>
                  )}
                  {section.content && (
                    <div
                      className="prose prose-gray dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                    />
                  )}
                </div>
              </div>
            );

          default:
            return (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className={`prose prose-gray dark:prose-invert max-w-none rounded-lg p-4 -m-4 ${getHighlightClasses(index)}`}
                dangerouslySetInnerHTML={{ __html: marked(section.content) }}
              />
            );
        }
      })}

      <style jsx global>{`
        .lesson-content {
          line-height: 1.8;
        }

        .prose h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: inherit;
        }

        .prose h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: inherit;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .dark .prose h2 {
          border-bottom-color: #374151;
        }

        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }

        .prose p {
          margin-bottom: 1rem;
        }

        .prose ul,
        .prose ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
        }

        .prose a {
          color: #dc2626;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #b91c1c;
        }

        .prose strong {
          font-weight: 700;
          color: inherit;
        }

        .prose em {
          font-style: italic;
        }

        .prose code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: monospace;
        }

        .dark .prose code {
          background-color: #374151;
        }

        .prose blockquote {
          border-left: 4px solid #dc2626;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .dark .prose blockquote {
          color: #9ca3af;
        }

        .prose hr {
          margin: 2rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
        }

        .dark .prose hr {
          border-top-color: #374151;
        }
      `}</style>
    </div>
  );
}
