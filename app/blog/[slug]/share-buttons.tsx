"use client";

import { Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
        title="Share on X/Twitter"
      >
        <Twitter size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-500 dark:text-gray-400 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>
    </div>
  );
}
