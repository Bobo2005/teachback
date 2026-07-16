
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { ChatMessage } from '@/lib/types';
// import ChatBubble from '@/components/ChatBubble';
// import ChatInput from '@/components/ChatInput';
// import LoadingState from '@/components/LoadingState';

// export default function TeachPage() {
//   const router = useRouter();
//   const [topic, setTopic] = useState<string | null>(null);
//   const [history, setHistory] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Initial load and fetching the AI's opening question
//   useEffect(() => {
//     const storedTopic = localStorage.getItem('teachback_topic');
//     if (!storedTopic) {
//       router.replace('/');
//       return;
//     }
//     setTopic(storedTopic);
    
//     const initSession = async () => {
//       try {
//         const res = await fetch('/api/chat', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ topic: storedTopic, history: [] }),
//         });
//         const data = await res.json();
        
//         if (data.reply) {
//           setHistory([{ role: 'assistant', content: data.reply }]);
//         }
//       } catch (error) {
//         console.error("Failed to start session", error);
//         setError("Trouble connecting to the student. Please try refreshing.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initSession();
//   }, [router]);

//   // Auto-scroll to the bottom when messages or loading state changes
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [history, isLoading]);

//   const handleSend = async (content: string) => {
//     setError(null); // Clear previous errors
//     const userMessage: ChatMessage = { role: 'user', content };
//     const updatedHistory = [...history, userMessage];
    
//     // Update UI immediately with user's message
//     setHistory(updatedHistory);
//     setIsLoading(true);

//     try {
//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ topic, history: updatedHistory }),
//       });
      
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Failed to connect to the student.');
      
//       if (data.reply) {
//         setHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
//       }
//     } catch (err: any) {
//       console.error("Failed to send message", err);
//       setError("The student got distracted. Could you try sending that again?");
//       // Revert the history so they can try again without losing context
//       setHistory(history); 
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFinishTeaching = () => {
//     // Save the full conversation transcript for the report generator
//     localStorage.setItem('teachback_transcript', JSON.stringify(history));
//     router.push('/report');
//   };

//   // Prevent flashing empty UI while routing checks run
//   if (!topic) return null;

//   return (
//     <div className="flex flex-col h-screen bg-board overflow-hidden">
      
//       {/* Header */}
//       <header className="px-6 py-4 border-b border-chalkWhite/10 flex justify-between items-center z-10 shrink-0">
//         <h2 className="font-display text-chalkYellow text-xl md:text-2xl tracking-wide">
//           Topic: {topic}
//         </h2>
//       </header>
      
//       {/* Scrollable Chat Area */}
//       <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
//         <div className="max-w-4xl mx-auto w-full">
//           {history.map((msg, index) => (
//             <ChatBubble key={index} message={msg} />
//           ))}
//           {isLoading && <LoadingState />}
//           <div ref={messagesEndRef} />
//         </div>
//       </main>

//       {/* Input Tray & Done Button */}
//       <div className="shrink-0 flex flex-col relative">
        
//         {/* Error Banner */}
//         {error && (
//           <div className="absolute -top-12 left-0 w-full flex justify-center z-20">
//             <div className="bg-chalkCoral text-paper font-body px-4 py-2 rounded shadow-md text-sm">
//               {error}
//             </div>
//           </div>
//         )}
        
//         <ChatInput onSend={handleSend} disabled={isLoading} />
        
//         <div className="bg-boardPanel pb-6 pt-3 flex justify-center">
//           <button 
//             onClick={handleFinishTeaching}
//             disabled={isLoading || history.length < 2}
//             className="font-body text-chalkCoral hover:text-chalkCoral/80 text-sm md:text-base tracking-wide underline underline-offset-4 decoration-chalkCoral/40 hover:decoration-chalkCoral/80 transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus:ring-4 focus:ring-chalkBlue/50 focus:rounded"
//           >
//             I'm done teaching. Generate my understanding report.
//           </button>
//         </div>
//       </div>
      
//     </div>
//   );
// } 

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import LoadingState from "@/components/LoadingState";
import type { ChatMessage } from "@/lib/types";

const FALLBACK_REPLY =
  "(the chalk squeaks but nothing comes out — I couldn't hear that. Could you try again?)";

export default function TeachPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
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
      setHistory([
        ...nextHistory,
        { role: "assistant", content: FALLBACK_REPLY },
      ]);
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
  }, [history, loading]);

  function handleSend(text: string) {
    if (!topic) return;
    const next: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(next);
    void requestReply(topic, next);
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
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="sticky bottom-0 mx-auto w-full max-w-2xl px-6 sm:px-10">
        <ChatInput onSend={handleSend} disabled={loading} />
        <div className="flex justify-center bg-boardPanel pb-5 pt-1">
          <button
            type="button"
            onClick={handleDone}
            className="font-body text-sm text-chalkWhite/60 underline decoration-chalkWhite/30 underline-offset-4 transition hover:text-chalkYellow hover:decoration-chalkYellow"
          >
            I&apos;m done teaching
          </button>
        </div>
      </div>
    </main>
  );
}