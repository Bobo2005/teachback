
'use client';

import { useEffect, useRef, useState } from 'react';

export default function ChalkAnnotation({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check user preference for motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={containerRef} className="relative inline-block whitespace-normal">
      <span className="relative z-10 font-medium">{children}</span>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M 5,50 C 8,15 35,2 65,8 C 95,12 98,35 92,65 C 88,95 40,98 15,85 C 0,75 2,55 5,50"
          fill="none"
          stroke="var(--chalkCoral, #E2887A)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: isVisible || reduceMotion ? 0 : 400,
            transition: reduceMotion ? 'none' : 'stroke-dashoffset 1.2s ease-out',
          }}
        />
      </svg>
    </span>
  );
}