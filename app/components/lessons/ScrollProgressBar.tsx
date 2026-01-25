"use client";

import { useEffect, useState, useCallback } from "react";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const [scrollContainer, setScrollContainer] = useState<Element | null>(null);

  // Find the scroll container after mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const frame = requestAnimationFrame(() => {
      const container = document.querySelector(".lesson-page-scroll");
      setScrollContainer(container);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainer) {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(scrollPercent);
    }
  }, [scrollContainer]);

  // Attach scroll listener when container is found
  useEffect(() => {
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer, handleScroll]);

  return (
    <div className="h-1 bg-black/20">
      <div className="h-full bg-white/50 transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}
