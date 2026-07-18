"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// --- Constants & Data ---

const STEPS = [
  {
    title: "Say it out loud",
    body: "Pick anything — a concept, a theorem, a slice of history — and explain it in your own words.",
    icon: (
      <path
        d="M16 3a4 4 0 0 1 4 4v6a4 4 0 1 1-8 0V7a4 4 0 0 1 4-4Z M8 14a8 8 0 0 0 16 0 M16 22v4 M11 26h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Get caught out",
    body: "Teachback plays a genuinely curious student — it asks real questions and notices when things don't add up.",
    icon: (
      <path
        d="M9 12a7 7 0 1 1 9.8 6.4c-.9.4-1.4 1.2-1.4 2.1v.5 M16 25.5h.02"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "See exactly what to fix",
    body: "Walk away with a report: what was clear, what was shaky, and what's worth reviewing next.",
    icon: (
      <path
        d="M8 6h16v20l-4-3-4 3-4-3-4 3V6Z M12 12h8 M12 17h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const PREVIEW_MESSAGES = [
  { role: "assistant" as const, content: "Okay — what's this about? Give me the big picture first." },
  { role: "user" as const, content: "The Krebs cycle breaks down acetyl-CoA to release energy." },
  { role: "assistant" as const, content: "Where does the acetyl-CoA actually come from?" },
];

// --- Sub-Components ---

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg font-semibold text-ink">
          Teachback
        </span>
        <a
          href="#start"
          className="rounded-full bg-brand px-4 py-2 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
        >
          Start Teaching
        </a>
      </div>
    </header>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-full w-full rounded-2xl border border-border bg-surfaceMuted"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-xs text-inkFaint">
            teachback — the Krebs cycle
          </span>
        </div>
        <div className="flex flex-col gap-4 px-5 py-6">
          {PREVIEW_MESSAGES.map((m, i) =>
            m.role === "assistant" ? (
              <div key={i} className="flex justify-start">
                <p className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-2.5 font-body text-sm text-ink shadow-sm">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 font-body text-sm text-white shadow-sm">
                  {m.content}
                </p>
              </div>
            )
          )}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkFaint [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkFaint [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkFaint" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

 function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    // Starting a fresh session — clear out anything left over from a
    // previous one so /report doesn't show stale, cached results.
    localStorage.removeItem("teachback_transcript");
    localStorage.removeItem("teachback_report");
    localStorage.setItem("teachback_topic", trimmed);
    router.push("/teach");
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-brandSoft blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-inkMuted">
            built on the Feynman technique
          </span>

          <h1 className="text-balance mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl md:text-6xl">
            Explain it. We&apos;ll catch what you missed.
          </h1>

          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-inkMuted sm:text-lg">
            The fastest way to find out if you actually understand
            something is to try teaching it. Teachback plays the student —
            curious, occasionally confused, and quick to notice when your
            story doesn&apos;t quite hold together.
          </p>

          <form
            id="start"
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
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
              className="w-full flex-1 rounded-lg border border-border bg-surface px-5 py-3.5 font-body text-base text-ink placeholder:text-inkFaint outline-none transition focus:border-brand sm:max-w-xs"
            />
            <button
              type="submit"
              disabled={!topic.trim()}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start Teaching
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              >
                <path
                  d="M4 10h11.5M10.5 5l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <p className="mt-3 font-body text-xs text-inkFaint">
            No signup — straight into the conversation.
          </p>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-brand">
            how it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Three steps, no prep required
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-canvas px-6 py-7"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brandSoft text-brand">
                <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5">
                  {step.icon}
                </svg>
              </span>
              <span className="mt-4 block font-mono text-xs text-inkFaint">
                step {i + 1}
              </span>
              <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-inkMuted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="border-t border-border py-20 text-center sm:py-28">
      <div className="mx-auto max-w-xl px-6">
        <p className="text-balance font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          For anyone who&apos;s ever said &ldquo;I get it, I just can&apos;t
          explain it.&rdquo;
        </p>
        <a
          href="#start"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
        >
          Try it now
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-6 text-center font-body text-xs text-inkFaint">
        Teachback — explain it, and find out what you actually know.
      </div>
    </footer>
  );
}

// --- Main Page Component ---

export default function Home() {
  return (
    <main className="min-h-dvh bg-canvas">
      <Header />
      <Hero />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </main>
  );
}