
// 'use client';

// import { useEffect, useRef, useState } from 'react';

// export default function ChalkAnnotation({ children }: { children: React.ReactNode }) {
//   const containerRef = useRef<HTMLSpanElement>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [reduceMotion, setReduceMotion] = useState(false);

//   useEffect(() => {
//     // Check user preference for motion
//     const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
//     setReduceMotion(mediaQuery.matches);

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <span ref={containerRef} className="relative inline-block whitespace-normal">
//       <span className="relative z-10 font-medium">{children}</span>
//       <svg
//         className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
//         preserveAspectRatio="none"
//         viewBox="0 0 100 100"
//       >
//         <path
//           d="M 5,50 C 8,15 35,2 65,8 C 95,12 98,35 92,65 C 88,95 40,98 15,85 C 0,75 2,55 5,50"
//           fill="none"
//           stroke="var(--chalkCoral, #E2887A)"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           vectorEffect="non-scaling-stroke"
//           style={{
//             strokeDasharray: 400,
//             strokeDashoffset: isVisible || reduceMotion ? 0 : 400,
//             transition: reduceMotion ? 'none' : 'stroke-dashoffset 1.2s ease-out',
//           }}
//         />
//       </svg>
//     </span>
//   );
// } 

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Wraps its children in an irregular, hand-drawn chalk circle. The stroke
 * "draws on" the first time it scrolls into view, using the pathLength trick
 * so we don't need to measure the actual path length in JS.
 */
export default function ChalkAnnotation({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <span
      ref={wrapperRef}
      className={`relative inline-block px-2.5 py-1.5 ${className ?? ""}`}
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 70"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)] overflow-visible"
      >
        <path
          d="M16 42 C9 24, 30 9, 62 7 C104 4, 152 3, 182 11 C206 17, 210 32, 199 43 C188 55, 155 62, 110 63 C68 64, 26 60, 13 49 C7 44, 9 45, 16 42 Z"
          fill="none"
          stroke="#E2887A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: visible ? 0 : 1,
            transition: prefersReducedMotion
              ? "none"
              : "stroke-dashoffset 900ms ease-out",
          }}
        />
      </svg>
    </span>
  );
}