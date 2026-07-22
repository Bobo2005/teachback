// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// // import LoadingState from "@/components/LoadingState";
// // import ReportCard from "@/components/ReportCard";
// // import { clearTeachbackStorage } from "@/lib/storage";
// // import type { ChatMessage, UnderstandingReport } from "@/lib/types";

// // function scoreTier(score: number): { label: string; className: string } {
// //   if (score >= 80) {
// //     return { label: "clear grasp", className: "bg-brandSoft text-brandDark" };
// //   }
// //   if (score >= 50) {
// //     return { label: "solid, with gaps", className: "bg-canvas text-inkMuted" };
// //   }
// //   return { label: "needs another pass", className: "bg-redpenSoft text-redpen" };
// // }

// // export default function ReportPage() {
// //   const router = useRouter();
// //   const [topic, setTopic] = useState<string | null>(null);
// //   const [transcript, setTranscript] = useState<ChatMessage[] | null>(null);
// //   const [report, setReport] = useState<UnderstandingReport | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Read required data on mount; bounce home if either is missing.
// //   useEffect(() => {
// //     const storedTopic = localStorage.getItem("teachback_topic");
// //     const storedTranscript = localStorage.getItem("teachback_transcript");

// //     if (!storedTopic || !storedTranscript) {
// //       router.replace("/");
// //       return;
// //     }

// //     try {
// //       const parsed = JSON.parse(storedTranscript) as ChatMessage[];
// //       if (!Array.isArray(parsed) || parsed.length === 0) {
// //         router.replace("/");
// //         return;
// //       }
// //       setTopic(storedTopic);
// //       setTranscript(parsed);
// //     } catch {
// //       router.replace("/");
// //     }
// //   }, [router]);

// //   // Use a cached report if we already generated one for this session,
// //   // otherwise fetch a fresh one.
// //   useEffect(() => {
// //     if (!topic || !transcript) return;

// //     const cached = localStorage.getItem("teachback_report");
// //     if (cached) {
// //       try {
// //         setReport(JSON.parse(cached) as UnderstandingReport);
// //         return;
// //       } catch {
// //         // fall through and regenerate
// //       }
// //     }

// //     void generateReport(topic, transcript);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [topic, transcript]);

// //   async function generateReport(topicValue: string, transcriptValue: ChatMessage[]) {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const res = await fetch("/api/report", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ topic: topicValue, transcript: transcriptValue }),
// //       });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error ?? "Request failed.");
// //       setReport(data as UnderstandingReport);
// //       localStorage.setItem("teachback_report", JSON.stringify(data));
// //     } catch (err) {
// //       console.error("Report request failed:", err);
// //       setError(
// //         "Couldn't put the report together just now. Check your connection and try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   function handleTeachAnother() {
// //     clearTeachbackStorage();
// //     router.push("/");
// //   }

// //   if (!topic || !transcript) {
// //     return (
// //       <main className="flex min-h-dvh items-center justify-center bg-canvas">
// //         <p className="font-body text-sm text-inkFaint">Loading…</p>
// //       </main>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6">
// //         <LoadingState label="Reading through the transcript…" />
// //       </main>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
// //         <p className="max-w-sm font-body text-inkMuted">{error}</p>
// //         <button
// //           type="button"
// //           onClick={() => void generateReport(topic, transcript)}
// //           className="rounded-lg bg-brand px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
// //         >
// //           Try again
// //         </button>
// //       </main>
// //     );
// //   }

// //   if (!report) return null;

// //   const tier = scoreTier(report.overallScore);

// //   return (
// //     <main className="min-h-dvh bg-canvas px-4 py-10 sm:px-6 sm:py-16">
// //       <div className="mx-auto w-full max-w-3xl">
// //         <a
// //           href="/"
// //           className="font-body text-xs font-semibold text-inkFaint transition hover:text-brand"
// //         >
// //           ← Teachback
// //         </a>

// //         <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-8 shadow-sm sm:px-12 sm:py-12">
// //           <header className="border-b border-border pb-8">
// //             <span className="font-body text-xs font-semibold uppercase tracking-widest text-inkFaint">
// //               your teachback report
// //             </span>
// //             <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
// //               {report.topic || topic}
// //             </h1>

// //             <div className="mt-6 flex flex-wrap items-end gap-4">
// //               <div className="flex items-baseline gap-1">
// //                 <span className="font-display text-6xl font-semibold text-ink sm:text-7xl">
// //                   {report.overallScore}
// //                 </span>
// //                 <span className="font-body text-lg text-inkFaint">/ 100</span>
// //               </div>
// //               <span
// //                 className={`rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${tier.className}`}
// //               >
// //                 {tier.label}
// //               </span>
// //             </div>
// //           </header>

// //           {report.clearPoints?.length > 0 && (
// //             <section className="mt-10">
// //               <h2 className="font-display text-xl font-semibold text-ink">
// //                 Explained clearly
// //               </h2>
// //               <div className="mt-4 flex flex-col gap-3">
// //                 {report.clearPoints.map((cp, i) => (
// //                   <ReportCard key={i} variant="clear" point={cp.point} quote={cp.quote} />
// //                 ))}
// //               </div>
// //             </section>
// //           )}

// //           {report.gaps?.length > 0 && (
// //             <section className="mt-10">
// //               <h2 className="font-display text-xl font-semibold text-ink">
// //                 Needs review
// //               </h2>
// //               <div className="mt-4 flex flex-col gap-3">
// //                 {report.gaps.map((gap, i) => (
// //                   <ReportCard
// //                     key={i}
// //                     variant="gap"
// //                     issue={gap.issue}
// //                     quote={gap.quote}
// //                     suggestion={gap.suggestion}
// //                   />
// //                 ))}
// //               </div>
// //             </section>
// //           )}

// //           {report.reviewSuggestions?.length > 0 && (
// //             <section className="mt-10">
// //               <h2 className="font-display text-xl font-semibold text-ink">
// //                 What to review next
// //               </h2>
// //               <ul className="mt-4 flex flex-col gap-2.5">
// //                 {report.reviewSuggestions.map((suggestion, i) => (
// //                   <li
// //                     key={i}
// //                     className="flex gap-2.5 font-body text-[15px] leading-relaxed text-inkMuted"
// //                   >
// //                     <span aria-hidden="true" className="text-inkFaint">
// //                       –
// //                     </span>
// //                     {suggestion}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </section>
// //           )}

// //           <div className="mt-12 flex justify-center border-t border-border pt-8">
// //             <button
// //               type="button"
// //               onClick={handleTeachAnother}
// //               className="rounded-full bg-brand px-8 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark active:translate-y-px"
// //             >
// //               Teach another topic
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // } 

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import LoadingState from "@/components/LoadingState";
// import ReportCard from "@/components/ReportCard";
// import { clearTeachbackStorage } from "@/lib/storage";
// import type { ChatMessage, UnderstandingReport } from "@/lib/types";

// function scoreTier(score: number): { label: string; className: string } {
//   if (score >= 80) {
//     return { label: "clear grasp", className: "bg-brandSoft text-brandDark" };
//   }
//   if (score >= 50) {
//     return { label: "solid, with gaps", className: "bg-canvas text-inkMuted" };
//   }
//   return { label: "needs another pass", className: "bg-redpenSoft text-redpen" };
// }

// export default function ReportPage() {
//   const router = useRouter();
//   const [topic, setTopic] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<ChatMessage[] | null>(null);
//   const [report, setReport] = useState<UnderstandingReport | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const storedTopic = localStorage.getItem("teachback_topic");
//     const storedTranscript = localStorage.getItem("teachback_transcript");

//     if (!storedTopic || !storedTranscript) {
//       router.replace("/");
//       return;
//     }

//     try {
//       const parsed = JSON.parse(storedTranscript) as ChatMessage[];
//       if (!Array.isArray(parsed) || parsed.length === 0) {
//         router.replace("/");
//         return;
//       }
//       setTopic(storedTopic);
//       setTranscript(parsed);
//     } catch {
//       router.replace("/");
//     }
//   }, [router]);

//   useEffect(() => {
//     if (!topic || !transcript) return;

//     const cached = localStorage.getItem("teachback_report");
//     if (cached) {
//       try {
//         setReport(JSON.parse(cached) as UnderstandingReport);
//         return;
//       } catch {
//         // fall through and regenerate
//       }
//     }

//     void generateReport(topic, transcript);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [topic, transcript]);

//   async function generateReport(topicValue: string, transcriptValue: ChatMessage[]) {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic: topicValue, transcript: transcriptValue }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error ?? "Request failed.");
//       setReport(data as UnderstandingReport);
//       localStorage.setItem("teachback_report", JSON.stringify(data));
//     } catch (err) {
//       console.error("Report request failed:", err);
//       setError(
//         "Couldn't put the report together just now. Check your connection and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleTeachAnother() {
//     clearTeachbackStorage();
//     router.push("/");
//   }

//   if (!topic || !transcript) {
//     return (
//       <main className="flex min-h-dvh items-center justify-center bg-canvas">
//         <p className="font-body text-sm text-inkFaint">Loading…</p>
//       </main>
//     );
//   }

//   if (loading) {
//     return (
//       <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6">
//         <LoadingState label="Reading through the transcript…" />
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
//         <p className="max-w-sm font-body text-inkMuted">{error}</p>
//         <button
//           type="button"
//           onClick={() => void generateReport(topic, transcript)}
//           className="rounded-lg bg-brand px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
//         >
//           Try again
//         </button>
//       </main>
//     );
//   }

//   if (!report) return null;

//   const tier = scoreTier(report.overallScore);

//   return (
//     <main className="min-h-dvh bg-canvas px-4 py-10 sm:px-6 sm:py-16">
//       <div className="mx-auto w-full max-w-3xl">
//         <a
//           href="/"
//           className="font-body text-xs font-semibold text-inkFaint transition hover:text-brand"
//         >
//           ← Teachback
//         </a>

//         <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-8 shadow-sm sm:px-12 sm:py-12">
//           <header className="border-b border-border pb-8">
//             <span className="font-body text-xs font-semibold uppercase tracking-widest text-inkFaint">
//               your teachback report
//             </span>
//             <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
//               {report.topic || topic}
//             </h1>

//             <div className="mt-6 flex flex-wrap items-end gap-4">
//               <div className="flex items-baseline gap-1">
//                 <span className="font-display text-6xl font-semibold text-ink sm:text-7xl">
//                   {report.overallScore}
//                 </span>
//                 <span className="font-body text-lg text-inkFaint">/ 100</span>
//               </div>
//               <span
//                 className={`rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${tier.className}`}
//               >
//                 {tier.label}
//               </span>
//             </div>
//           </header>

//           {report.clearPoints?.length > 0 && (
//             <section className="mt-10">
//               <h2 className="font-display text-xl font-semibold text-ink">
//                 Explained clearly
//               </h2>
//               <div className="mt-4 flex flex-col gap-3">
//                 {report.clearPoints.map((cp, i) => (
//                   <ReportCard key={i} variant="clear" point={cp.point} quote={cp.quote} />
//                 ))}
//               </div>
//             </section>
//           )}

//           {report.gaps?.length > 0 && (
//             <section className="mt-10">
//               <h2 className="font-display text-xl font-semibold text-ink">
//                 Needs review
//               </h2>
//               <div className="mt-4 flex flex-col gap-3">
//                 {report.gaps.map((gap, i) => (
//                   <ReportCard
//                     key={i}
//                     variant="gap"
//                     issue={gap.issue}
//                     quote={gap.quote}
//                     suggestion={gap.suggestion}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {report.contradictions?.length > 0 && (
//             <section className="mt-10">
//               <h2 className="font-display text-xl font-semibold text-ink">
//                 Caught you contradicting yourself
//               </h2>
//               <div className="mt-4 flex flex-col gap-3">
//                 {report.contradictions.map((c, i) => (
//                   <ReportCard
//                     key={i}
//                     variant="contradiction"
//                     firstQuote={c.firstQuote}
//                     laterQuote={c.laterQuote}
//                     explanation={c.explanation}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {report.reviewSuggestions?.length > 0 && (
//             <section className="mt-10">
//               <h2 className="font-display text-xl font-semibold text-ink">
//                 What to review next
//               </h2>
//               <ul className="mt-4 flex flex-col gap-2.5">
//                 {report.reviewSuggestions.map((suggestion, i) => (
//                   <li
//                     key={i}
//                     className="flex gap-2.5 font-body text-[15px] leading-relaxed text-inkMuted"
//                   >
//                     <span aria-hidden="true" className="text-inkFaint">
//                       –
//                     </span>
//                     {suggestion}
//                   </li>
//                 ))}
//               </ul>
//             </section>
//           )}

//           <div className="mt-12 flex justify-center border-t border-border pt-8">
//             <button
//               type="button"
//               onClick={handleTeachAnother}
//               className="rounded-full bg-brand px-8 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark active:translate-y-px"
//             >
//               Teach another topic
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import PracticeQuiz from "@/components/PracticeQuiz";
import ReportCard from "@/components/ReportCard";
import { clearTeachbackStorage } from "@/lib/storage";
import type {
  ChatMessage,
  Gap,
  PracticeQuestion,
  PracticeResult,
  UnderstandingReport,
} from "@/lib/types";

const PRACTICE_STORAGE_KEY = "teachback_practice";

type PracticeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "active"; questions: PracticeQuestion[] }
  | { status: "done"; result: PracticeResult }
  | { status: "error"; message: string };

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 80) {
    return { label: "clear grasp", className: "bg-brandSoft text-brandDark" };
  }
  if (score >= 50) {
    return { label: "solid, with gaps", className: "bg-canvas text-inkMuted" };
  }
  return { label: "needs another pass", className: "bg-redpenSoft text-redpen" };
}

function practicePillClassName(score: number, total: number): string {
  return score / total >= 0.6
    ? "bg-brandSoft text-brandDark"
    : "bg-redpenSoft text-redpen";
}

function readStoredPracticeResults(): Record<number, PracticeResult> {
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<number, PracticeResult>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function persistPracticeResult(gapIndex: number, result: PracticeResult) {
  const existing = readStoredPracticeResults();
  existing[gapIndex] = result;
  localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(existing));
}

export default function ReportPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<ChatMessage[] | null>(null);
  const [report, setReport] = useState<UnderstandingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [practice, setPractice] = useState<Record<number, PracticeState>>({});

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

    // Restore any practice results completed earlier in this session so a
    // refresh doesn't reset quizzes the user already finished.
    const storedResults = readStoredPracticeResults();
    const restored: Record<number, PracticeState> = {};
    for (const [key, result] of Object.entries(storedResults)) {
      restored[Number(key)] = { status: "done", result };
    }
    setPractice(restored);
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

  async function startPractice(gapIndex: number, gap: Gap) {
    if (!topic) return;
    setPractice((prev) => ({ ...prev, [gapIndex]: { status: "loading" } }));
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, gap }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setPractice((prev) => ({
        ...prev,
        [gapIndex]: { status: "active", questions: data.questions as PracticeQuestion[] },
      }));
    } catch (err) {
      console.error("Practice request failed:", err);
      setPractice((prev) => ({
        ...prev,
        [gapIndex]: {
          status: "error",
          message: "Couldn't generate a quiz just now. Try again.",
        },
      }));
    }
  }

  function handlePracticeComplete(gapIndex: number, result: PracticeResult) {
    // Deliberately NOT switching status away from "active" here — PracticeQuiz
    // stays mounted and shows its own detailed per-question summary. The
    // compact "Practiced: X/Y" pill is only for results restored from a
    // previous session on page load (see the mount effect above), so a user
    // who just finished the quiz actually gets to see their results instead
    // of the pill instantly replacing the summary they just earned.
    persistPracticeResult(gapIndex, result);
  }

  function handleTeachAnother() {
    clearTeachbackStorage();
    router.push("/");
  }

  if (!topic || !transcript) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="font-body text-sm text-inkFaint">Loading…</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6">
        <LoadingState label="Reading through the transcript…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
        <p className="max-w-sm font-body text-inkMuted">{error}</p>
        <button
          type="button"
          onClick={() => void generateReport(topic, transcript)}
          className="rounded-lg bg-brand px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-brandDark"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!report) return null;

  const tier = scoreTier(report.overallScore);

  return (
    <main className="min-h-dvh bg-canvas px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <a
          href="/"
          className="font-body text-xs font-semibold text-inkFaint transition hover:text-brand"
        >
          ← Teachback
        </a>

        <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-8 shadow-sm sm:px-12 sm:py-12">
          <header className="border-b border-border pb-8">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-inkFaint">
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
                <span className="font-body text-lg text-inkFaint">/ 100</span>
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
                {report.gaps.map((gap, i) => {
                  const state = practice[i] ?? { status: "idle" as const };
                  return (
                    <ReportCard
                      key={i}
                      variant="gap"
                      issue={gap.issue}
                      quote={gap.quote}
                      suggestion={gap.suggestion}
                    >
                      <div className="mt-3">
                        {state.status === "idle" && (
                          <button
                            type="button"
                            onClick={() => void startPractice(i, gap)}
                            className="rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                          >
                            Test yourself
                          </button>
                        )}

                        {state.status === "loading" && (
                          <LoadingState label="Putting together a few questions…" />
                        )}

                        {state.status === "error" && (
                          <div className="flex items-center gap-3">
                            <p className="font-body text-sm text-redpen">{state.message}</p>
                            <button
                              type="button"
                              onClick={() => void startPractice(i, gap)}
                              className="font-body text-sm font-semibold text-redpen underline underline-offset-4 transition hover:text-ink"
                            >
                              Try again
                            </button>
                          </div>
                        )}

                        {state.status === "active" && (
                          <PracticeQuiz
                            questions={state.questions}
                            onComplete={(result) => handlePracticeComplete(i, result)}
                          />
                        )}

                        {state.status === "done" && (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${practicePillClassName(
                              state.result.score,
                              state.result.total
                            )}`}
                          >
                            Practiced: {state.result.score} / {state.result.total}
                          </span>
                        )}
                      </div>
                    </ReportCard>
                  );
                })}
              </div>
            </section>
          )}

          {report.contradictions?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink">
                Caught you contradicting yourself
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {report.contradictions.map((c, i) => (
                  <ReportCard
                    key={i}
                    variant="contradiction"
                    firstQuote={c.firstQuote}
                    laterQuote={c.laterQuote}
                    explanation={c.explanation}
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
                    className="flex gap-2.5 font-body text-[15px] leading-relaxed text-inkMuted"
                  >
                    <span aria-hidden="true" className="text-inkFaint">
                      –
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 flex justify-center border-t border-border pt-8">
            <button
              type="button"
              onClick={handleTeachAnother}
              className="rounded-full bg-brand px-8 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark active:translate-y-px"
            >
              Teach another topic
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}