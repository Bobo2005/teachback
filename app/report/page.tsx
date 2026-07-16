"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import ReportCard from "@/components/ReportCard";
import { clearTeachbackStorage } from "@/lib/storage";
import type { ChatMessage, UnderstandingReport } from "@/lib/types";

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 80) {
    return { label: "clear grasp", className: "bg-chalkYellow/20 text-ink" };
  }
  if (score >= 50) {
    return { label: "solid, with gaps", className: "bg-chalkYellow/10 text-ink" };
  }
  return { label: "needs another pass", className: "bg-chalkCoral/15 text-ink" };
}

export default function ReportPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<ChatMessage[] | null>(null);
  const [report, setReport] = useState<UnderstandingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read required data on mount; bounce home if either is missing.
  useEffect(() => {
    const storedTopic = localStorage.getItem("teachback_topic");
    const storedTranscript = localStorage.getItem("teachback_transcript");

    if (!storedTopic || !storedTranscript) {
      router.replace("/");
      return;
    }

    try {
      const parsed = JSON.parse(storedTranscript) as ChatMessage[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        router.replace("/");
        return;
      }
      setTopic(storedTopic);
      setTranscript(parsed);
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Use a cached report if we already generated one for this session,
  // otherwise fetch a fresh one.
  useEffect(() => {
    if (!topic || !transcript) return;

    const cached = localStorage.getItem("teachback_report");
    if (cached) {
      try {
        setReport(JSON.parse(cached) as UnderstandingReport);
        return;
      } catch {
        // fall through and regenerate
      }
    }

    void generateReport(topic, transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, transcript]);

  async function generateReport(topicValue: string, transcriptValue: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicValue, transcript: transcriptValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setReport(data as UnderstandingReport);
      localStorage.setItem("teachback_report", JSON.stringify(data));
    } catch (err) {
      console.error("Report request failed:", err);
      setError(
        "Couldn't put the report together just now. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTeachAnother() {
    clearTeachbackStorage();
    router.push("/");
  }

  if (!topic || !transcript) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-board">
        <p className="font-annotation text-2xl text-chalkWhite/60">
          opening the board…
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-board px-6">
        <LoadingState label="reading through the transcript…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-board px-6 text-center">
        <p className="max-w-sm font-body text-chalkWhite/70">{error}</p>
        <button
          type="button"
          onClick={() => void generateReport(topic, transcript)}
          className="rounded-sm bg-chalkBlue px-6 py-3 font-body text-sm font-semibold text-board transition hover:brightness-110"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!report) return null;

  const tier = scoreTier(report.overallScore);

  return (
    <main className="chalk-grain relative flex min-h-dvh justify-center bg-board px-4 py-10 sm:px-6 sm:py-16">
      <div className="relative w-full max-w-3xl rounded-lg border border-ink/5 bg-paper px-6 py-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:px-12 sm:py-12">
        <header className="border-b border-ink/10 pb-8">
          <span className="font-annotation text-xl text-ink/50">
            your teachback report
          </span>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {report.topic || topic}
          </h1>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-6xl font-semibold text-ink sm:text-7xl">
                {report.overallScore}
              </span>
              <span className="font-body text-lg text-ink/40">/ 100</span>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${tier.className}`}
            >
              {tier.label}
            </span>
          </div>
        </header>

        {report.clearPoints?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Explained clearly
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {report.clearPoints.map((cp, i) => (
                <ReportCard key={i} variant="clear" point={cp.point} quote={cp.quote} />
              ))}
            </div>
          </section>
        )}

        {report.gaps?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Needs review
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {report.gaps.map((gap, i) => (
                <ReportCard
                  key={i}
                  variant="gap"
                  issue={gap.issue}
                  quote={gap.quote}
                  suggestion={gap.suggestion}
                />
              ))}
            </div>
          </section>
        )}

        {report.reviewSuggestions?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              What to review next
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {report.reviewSuggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 font-body text-[15px] leading-relaxed text-ink/80"
                >
                  <span aria-hidden="true" className="text-ink/30">
                    –
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex justify-center border-t border-ink/10 pt-8">
          <button
            type="button"
            onClick={handleTeachAnother}
            className="rounded-sm bg-chalkBlue px-8 py-3.5 font-body text-sm font-semibold tracking-wide text-board transition hover:brightness-110 active:translate-y-px"
          >
            Teach another topic
          </button>
        </div>
      </div>
    </main>
  );
}