"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    localStorage.setItem("teachback_topic", trimmed);
    router.push("/teach");
  }

  return (
    <main className="chalk-grain relative min-h-dvh overflow-hidden bg-board">
      {/* chalk tray line along the bottom, like the ledge of a real board */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-boardPanel/70" />

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 font-annotation text-2xl text-chalkYellow/90 sm:text-3xl">
          — the board is listening
        </span>

        <h1 className="text-balance font-display text-4xl font-semibold leading-[1.12] text-chalkWhite sm:text-5xl md:text-6xl">
          Explain it. We&apos;ll catch what you missed.
        </h1>

        <svg
          aria-hidden="true"
          viewBox="0 0 320 24"
          className="mt-6 h-5 w-56 text-chalkCoral/80 sm:w-64"
        >
          <path
            d="M6 14C60 4, 120 20, 160 10S 260 2, 314 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <p className="mt-8 max-w-md font-body text-base text-chalkWhite/70 sm:text-lg">
          Teach a topic out loud, in your own words. Teachback listens like a
          curious student, and tells you exactly where the explanation gets
          shaky.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex w-full max-w-md flex-col items-center gap-5"
        >
          <div className="relative w-full -rotate-1">
            <label htmlFor="topic" className="sr-only">
              What do you want to teach me?
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              autoComplete="off"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to teach me?"
              className="w-full rounded-sm border border-ink/10 bg-paper px-6 py-5 font-body text-lg text-ink placeholder:text-ink/40 shadow-[0_10px_0_-4px_rgba(0,0,0,0.18),0_18px_30px_-12px_rgba(0,0,0,0.45)] outline-none transition focus:-translate-y-0.5 focus:shadow-[0_14px_0_-4px_rgba(0,0,0,0.2),0_22px_34px_-12px_rgba(0,0,0,0.5)]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -top-3 h-6 w-9 -rotate-6 rounded-[2px] bg-chalkYellow/25"
            />
          </div>

          <span className="font-annotation text-xl text-chalkWhite/60">
            a concept, a theorem, a chapter of history — anything.
          </span>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="mt-2 rounded-sm bg-chalkBlue px-8 py-4 font-body text-base font-semibold tracking-wide text-board transition hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Teaching
          </button>
        </form>
      </div>
    </main>
  );
}