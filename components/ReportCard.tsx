import PenAnnotation from "@/components/PenAnnotation";

type ReportCardProps =
  | { variant: "clear"; point: string; quote: string }
  | { variant: "gap"; issue: string; quote: string; suggestion: string };

export default function ReportCard(props: ReportCardProps) {
  if (props.variant === "clear") {
    return (
      <div className="flex gap-4 rounded-xl border border-border bg-surface px-5 py-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandSoft text-brand"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path
              d="M3 8.5 6.2 12 13 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="font-body text-[15px] font-semibold leading-snug text-ink">
            {props.point}
          </p>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-inkMuted">
            “{props.quote}”
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface px-5 py-4">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-redpenSoft text-redpen"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <path
            d="M8 4.5v4.2M8 11.3h.01"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <p className="font-body text-[15px] font-semibold leading-snug text-ink">
          {props.issue}
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-inkMuted">
          “<PenAnnotation>{props.quote}</PenAnnotation>”
        </p>
        <p className="mt-2 flex items-start gap-1.5 font-mono text-xs leading-relaxed text-inkFaint">
          <span aria-hidden="true" className="text-redpen">→</span>
          {props.suggestion}
        </p>
      </div>
    </div>
  );
}