
import { ReactNode } from 'react';

interface ReportCardProps {
  title: string;
  quote: ReactNode;
  suggestion?: string;
}

export default function ReportCard({ title, quote, suggestion }: ReportCardProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 items-start border-l-4 border-boardPanel pl-4 py-2">
      <div className="flex-1">
        <p className="font-body text-ink font-semibold mb-2">{title}</p>
        <blockquote className="font-body text-ink/80 italic text-lg leading-relaxed">
          "{quote}"
        </blockquote>
      </div>
      {suggestion && (
        <div className="md:w-1/3 flex-shrink-0 mt-2 md:mt-0">
          <p className="font-annotation text-2xl text-boardPanel -rotate-2 bg-chalkWhite/40 p-3 rounded shadow-sm">
            {suggestion}
          </p>
        </div>
      )}
    </div>
  );
}