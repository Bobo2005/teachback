
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnderstandingReport } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ChalkAnnotation from '@/components/ChalkAnnotation';
import ReportCard from '@/components/ReportCard';

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<UnderstandingReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedReport = localStorage.getItem('teachback_report');
    if (cachedReport) {
      setReport(JSON.parse(cachedReport));
      return;
    }

    const topic = localStorage.getItem('teachback_topic');
    const transcriptStr = localStorage.getItem('teachback_transcript');

    if (!topic || !transcriptStr) {
      router.replace('/');
      return;
    }

    const transcript = JSON.parse(transcriptStr);

    const fetchReport = async () => {
      try {
        const res = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, transcript }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to generate report.');

        localStorage.setItem('teachback_report', JSON.stringify(data));
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong generating your report.');
      }
    };

    fetchReport();
  }, [router]);

  const handleReset = () => {
    localStorage.removeItem('teachback_topic');
    localStorage.removeItem('teachback_transcript');
    localStorage.removeItem('teachback_report');
    router.push('/');
  };

  if (error) {
    return (
      <main className="min-h-screen bg-board p-6 flex flex-col items-center justify-center">
        <div className="bg-paper p-8 rounded shadow-lg max-w-xl text-center space-y-6">
          <h2 className="font-display text-3xl text-chalkCoral">Oops, something snapped.</h2>
          <p className="font-body text-ink">{error}</p>
          <button onClick={handleReset} className="bg-chalkBlue text-board font-display px-6 py-2 rounded font-semibold focus:outline-none focus:ring-4 focus:ring-chalkBlue/50">
            Start Over
          </button>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-board flex flex-col items-center justify-center space-y-6">
        <h2 className="font-annotation text-4xl text-chalkWhite">Grading your explanation...</h2>
        <LoadingState />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-board p-6 md:p-12 lg:p-24 flex justify-center">
      <div className="bg-paper w-full max-w-4xl rounded shadow-2xl p-8 md:p-16 flex flex-col gap-12 relative overflow-hidden">
        
        {/* Header & Score */}
        <header className="border-b-2 border-boardPanel/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-annotation text-3xl text-boardPanel mb-2">Topic:</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">{report.topic}</h1>
          </div>
          <div className="text-right">
            <p className="font-annotation text-2xl text-boardPanel mb-1">Clarity Score</p>
            <p className="font-display text-6xl md:text-7xl text-chalkBlue">{report.overallScore}<span className="text-3xl text-ink/40">/100</span></p>
          </div>
        </header>

        {/* Clear Points */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Explained Clearly</h2>
          <div className="space-y-6">
            {report.clearPoints.map((pt, i) => (
              <ReportCard 
                key={i} 
                title={pt.point} 
                quote={<span className="border-b-4 border-chalkYellow">{pt.quote}</span>} 
              />
            ))}
          </div>
        </section>

        {/* Needs Review (Gaps) */}
        {report.gaps.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-6">Needs Review</h2>
            <div className="space-y-8">
              {report.gaps.map((gap, i) => (
                <ReportCard 
                  key={i} 
                  title={gap.issue} 
                  suggestion={gap.suggestion}
                  quote={<ChalkAnnotation>{gap.quote}</ChalkAnnotation>} 
                />
              ))}
            </div>
          </section>
        )}

        {/* What to review next */}
        {report.reviewSuggestions.length > 0 && (
          <section className="bg-chalkWhite/30 p-6 rounded border border-boardPanel/10">
            <h2 className="font-display text-2xl text-ink mb-4">What to review next</h2>
            <ul className="space-y-3">
              {report.reviewSuggestions.map((sug, i) => (
                <li key={i} className="font-body text-ink text-lg flex items-start">
                  <span className="text-chalkCoral mr-3 mt-1 font-bold">→</span> {sug}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Action */}
        <div className="pt-8 flex justify-center border-t-2 border-boardPanel/10">
          <button
            onClick={handleReset}
            className="bg-chalkBlue text-board font-display font-semibold text-xl md:text-2xl px-10 py-4 rounded shadow hover:bg-chalkBlue/90 hover:scale-[1.02] active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-chalkBlue/50"
          >
            Teach another topic
          </button>
        </div>
      </div>
    </main>
  );
}