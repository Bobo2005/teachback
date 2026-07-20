// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
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

//   // Read required data on mount; bounce home if either is missing.
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

//   // Use a cached report if we already generated one for this session,
//   // otherwise fetch a fresh one.
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
import ReportCard from "@/components/ReportCard";
import { clearTeachbackStorage } from "@/lib/storage";
import type { ChatMessage, UnderstandingReport } from "@/lib/types";

function scoreTier(score: number): { label: string; className: string } {
  if (score >= 80) {
    return { label: "clear grasp", className: "bg-brandSoft text-brandDark" };
  }
  if (score >= 50) {
    return { label: "solid, with gaps", className: "bg-canvas text-inkMuted" };
  }
  return { label: "needs another pass", className: "bg-redpenSoft text-redpen" };
}

export default function ReportPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<ChatMessage[] | null>(null);
  const [report, setReport] = useState<UnderstandingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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