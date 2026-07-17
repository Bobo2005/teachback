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
 * Teachback's signature moment: a quick, confident red-pen circle drawn
 * around a quote, like a teacher marking exactly where something needs a
 * second look. Draws itself on the first time it scrolls into view, using
 * the pathLength trick so we don't need to measure the real path length.
 */
export default function PenAnnotation({
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
        viewBox="0 0 220 64"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.75rem)] overflow-visible"
      >
        <path
          d="M14 40 C8 22, 32 10, 66 8 C110 5, 158 6, 188 16 C204 21, 208 33, 197 42 C182 55, 138 60, 92 60 C58 60, 26 55, 15 46 C11 43, 12 42, 14 40"
          fill="none"
          stroke="#D64545"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: visible ? 0 : 1,
            transition: prefersReducedMotion
              ? "none"
              : "stroke-dashoffset 700ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
      </svg>
    </span>
  );
}