"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import LoadingState from "@/components/LoadingState";
import type { ChatMessage } from "@/lib/types";

export default function TeachPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Read the topic on mount; bounce back to the landing page if it's missing.
  useEffect(() => {
    const stored = localStorage.getItem("teachback_topic");
    if (!stored) {
      router.replace("/");
      return;
    }
    setTopic(stored);
  }, [router]);

  async function requestReply(topicValue: string, nextHistory: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicValue, history: nextHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setHistory([...nextHistory, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setError(
        "Couldn't reach the student just now. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Kick off the AI's opening question once we know the topic.
  useEffect(() => {
    if (topic && history.length === 0) {
      void requestReply(topic, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading, error]);

  function handleSend(text: string) {
    if (!topic) return;
    const next: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(next);
    void requestReply(topic, next);
  }

  function handleRetry() {
    if (!topic) return;
    void requestReply(topic, history);
  }

  function handleDone() {
    localStorage.setItem("teachback_transcript", JSON.stringify(history));
    router.push("/report");
  }

  if (!topic) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="font-body text-sm text-inkFaint">Loading…</p>
      </main>
    );
  }

  // Nothing has loaded yet and the opening question failed outright.
  if (error && history.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
        <p className="max-w-sm font-body text-inkMuted">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-lg bg-brand px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4 sm:px-10">
        <div>
          <Link
            href="/"
            className="font-body text-xs font-semibold text-inkFaint transition hover:text-brand"
          >
            ← Teachback
          </Link>
          <h1 className="mt-0.5 font-display text-lg font-semibold text-ink sm:text-xl">
            {topic}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleDone}
          disabled={history.length === 0}
          className="shrink-0 rounded-full border border-border bg-canvas px-4 py-2 font-body text-sm font-semibold text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          I&apos;m done teaching
        </button>
      </header>

      <div className="relative flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {history.map((message, i) => (
            <ChatBubble key={i} message={message} />
          ))}
          {loading && <LoadingState />}
          {error && history.length > 0 && (
            <div className="flex flex-col items-start gap-2 rounded-lg border border-redpen/25 bg-redpenSoft px-4 py-3 sm:max-w-[75%]">
              <p className="font-body text-sm text-redpen">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="font-body text-sm font-semibold text-redpen underline underline-offset-4 transition hover:text-ink"
              >
                Try again
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </main>
  );
}