import ChalkAnnotation from "@/components/ChalkAnnotation";

type ReportCardProps =
  | { variant: "clear"; point: string; quote: string }
  | { variant: "gap"; issue: string; quote: string; suggestion: string };

export default function ReportCard(props: ReportCardProps) {
  if (props.variant === "clear") {
    return (
      <div className="rounded-sm border-l-4 border-chalkYellow bg-ink/[0.03] px-5 py-4">
        <p className="font-body text-[15px] font-semibold leading-snug text-ink">
          {props.point}
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">
          “
          <span className="underline decoration-chalkYellow decoration-2 underline-offset-4">
            {props.quote}
          </span>
          ”
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border-l-4 border-chalkCoral bg-ink/[0.03] px-5 py-4">
      <p className="font-body text-[15px] font-semibold leading-snug text-ink">
        {props.issue}
      </p>
      <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">
        “<ChalkAnnotation>{props.quote}</ChalkAnnotation>”
      </p>
      <p className="mt-2 font-annotation text-xl leading-snug text-ink/60">
        ↳ {props.suggestion}
      </p>
    </div>
  );
}