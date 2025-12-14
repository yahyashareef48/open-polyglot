"use client";

/**
 * LessonContent Component
 *
 * Renders lesson content with support for markdown formatting.
 * Handles different content section types (text, vocabulary, grammar, etc.)
 */

import { LessonContent as LessonContentType } from "@/app/types/content";
import { marked } from "marked";

interface LessonContentProps {
  content: LessonContentType;
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="lesson-content">
      {content.sections.map((section, index) => {
        switch (section.type) {
          case "text":
            return (
              <div
                key={index}
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(section.content) }}
              />
            );

          case "vocabulary":
            return (
              <div key={index} className="my-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600">
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                </div>
              </div>
            );

          case "grammar":
            return (
              <div key={index} className="my-8">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-l-4 border-purple-600">
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                </div>
              </div>
            );

          case "dialogue":
            return (
              <div key={index} className="my-8">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-600">
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                </div>
              </div>
            );

          case "audio":
            return (
              <div key={index} className="my-8">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  {section.audioUrl && (
                    <audio controls className="w-full mb-4">
                      <source src={section.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {section.content && (
                    <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                  )}
                </div>
              </div>
            );

          case "video":
            return (
              <div key={index}>
                {section.videoUrl && (
                  <div className="aspect-video bg-black w-full">
                    <iframe src={section.videoUrl} className="w-full h-full" allowFullScreen title="Lesson video" />
                  </div>
                )}
                {section.content && (
                  <div className="prose prose-gray dark:prose-invert max-w-none mt-8" dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                )}
              </div>
            );

          default:
            return (
              <div
                key={index}
                className="prose prose-gray dark:prose-invert max-w-none"
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
