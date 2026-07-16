

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import ChatBubble from "@/components/ChatBubble";
// import ChatInput from "@/components/ChatInput";
// import LoadingState from "@/components/LoadingState";
// import type { ChatMessage } from "@/lib/types";

// const FALLBACK_REPLY =
//   "(the chalk squeaks but nothing comes out — I couldn't hear that. Could you try again?)";

// export default function TeachPage() {
//   const router = useRouter();
//   const [topic, setTopic] = useState<string | null>(null);
//   const [history, setHistory] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Read the topic on mount; bounce back to the landing page if it's missing.
//   useEffect(() => {
//     const stored = localStorage.getItem("teachback_topic");
//     if (!stored) {
//       router.replace("/");
//       return;
//     }
//     setTopic(stored);
//   }, [router]);

//   async function requestReply(topicValue: string, nextHistory: ChatMessage[]) {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic: topicValue, history: nextHistory }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error ?? "Request failed.");
//       setHistory([...nextHistory, { role: "assistant", content: data.reply }]);
//     } catch (err) {
//       console.error("Chat request failed:", err);
//       setHistory([
//         ...nextHistory,
//         { role: "assistant", content: FALLBACK_REPLY },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Kick off the AI's opening question once we know the topic.
//   useEffect(() => {
//     if (topic && history.length === 0) {
//       void requestReply(topic, []);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [topic]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [history, loading]);

//   function handleSend(text: string) {
//     if (!topic) return;
//     const next: ChatMessage[] = [...history, { role: "user", content: text }];
//     setHistory(next);
//     void requestReply(topic, next);
//   }

//   function handleDone() {
//     localStorage.setItem("teachback_transcript", JSON.stringify(history));
//     router.push("/report");
//   }

//   if (!topic) {
//     return (
//       <main className="flex min-h-dvh items-center justify-center bg-board">
//         <p className="font-annotation text-2xl text-chalkWhite/60">
//           opening the board…
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="flex min-h-dvh flex-col bg-board">
//       <header className="chalk-grain relative border-b border-chalkWhite/10 px-6 py-5 sm:px-10">
//         <span className="font-annotation text-lg text-chalkWhite/50">
//           you&apos;re teaching
//         </span>
//         <h1 className="font-display text-xl font-semibold text-chalkWhite sm:text-2xl">
//           {topic}
//         </h1>
//       </header>

//       <div className="chalk-grain relative flex-1 overflow-y-auto px-6 py-8 sm:px-10">
//         <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
//           {history.map((message, i) => (
//             <ChatBubble key={i} message={message} />
//           ))}
//           {loading && <LoadingState />}
//           <div ref={bottomRef} />
//         </div>
//       </div>

//       <div className="sticky bottom-0 mx-auto w-full max-w-2xl px-6 sm:px-10">
//         <ChatInput onSend={handleSend} disabled={loading} />
//         <div className="flex justify-center bg-boardPanel pb-5 pt-1">
//           <button
//             type="button"
//             onClick={handleDone}
//             className="font-body text-sm text-chalkWhite/60 underline decoration-chalkWhite/30 underline-offset-4 transition hover:text-chalkYellow hover:decoration-chalkYellow"
//           >
//             I&apos;m done teaching
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// } 

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
      <main className="flex min-h-dvh items-center justify-center bg-board">
        <p className="font-annotation text-2xl text-chalkWhite/60">
          opening the board…
        </p>
      </main>
    );
  }

  // Nothing has loaded yet and the opening question failed outright.
  if (error && history.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-board px-6 text-center">
        <p className="max-w-sm font-body text-chalkWhite/70">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-sm bg-chalkBlue px-6 py-3 font-body text-sm font-semibold text-board transition hover:brightness-110"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-board">
      <header className="chalk-grain relative border-b border-chalkWhite/10 px-6 py-5 sm:px-10">
        <span className="font-annotation text-lg text-chalkWhite/50">
          you&apos;re teaching
        </span>
        <h1 className="font-display text-xl font-semibold text-chalkWhite sm:text-2xl">
          {topic}
        </h1>
      </header>

      <div className="chalk-grain relative flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          {history.map((message, i) => (
            <ChatBubble key={i} message={message} />
          ))}
          {loading && <LoadingState />}
          {error && history.length > 0 && (
            <div className="flex flex-col items-start gap-2 rounded-sm border border-chalkCoral/30 bg-chalkCoral/10 px-4 py-3 sm:max-w-[75%]">
              <p className="font-body text-sm text-chalkCoral">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="font-body text-sm font-semibold text-chalkCoral underline underline-offset-4 transition hover:text-chalkWhite"
              >
                Try again
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="sticky bottom-0 mx-auto w-full max-w-2xl px-6 sm:px-10">
        <ChatInput onSend={handleSend} disabled={loading} />
        <div className="flex justify-center bg-boardPanel pb-5 pt-1">
          <button
            type="button"
            onClick={handleDone}
            disabled={history.length === 0}
            className="font-body text-sm text-chalkWhite/60 underline decoration-chalkWhite/30 underline-offset-4 transition hover:text-chalkYellow hover:decoration-chalkYellow disabled:cursor-not-allowed disabled:opacity-40"
          >
            I&apos;m done teaching
          </button>
        </div>
      </div>
    </main>
  );
}