// import PenAnnotation from "@/components/PenAnnotation";

// type ReportCardProps =
//   | { variant: "clear"; point: string; quote: string }
//   | { variant: "gap"; issue: string; quote: string; suggestion: string };

// export default function ReportCard(props: ReportCardProps) {
//   if (props.variant === "clear") {
//     return (
//       <div className="flex gap-4 rounded-xl border border-border bg-surface px-5 py-4">
//         <span
//           aria-hidden="true"
//           className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandSoft text-brand"
//         >
//           <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
//             <path
//               d="M3 8.5 6.2 12 13 4"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </span>
//         <div>
//           <p className="font-body text-[15px] font-semibold leading-snug text-ink">
//             {props.point}
//           </p>
//           <p className="mt-1.5 font-body text-sm leading-relaxed text-inkMuted">
//             “{props.quote}”
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-4 rounded-xl border border-border bg-surface px-5 py-4">
//       <span
//         aria-hidden="true"
//         className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-redpenSoft text-redpen"
//       >
//         <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
//           <path
//             d="M8 4.5v4.2M8 11.3h.01"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </span>
//       <div>
//         <p className="font-body text-[15px] font-semibold leading-snug text-ink">
//           {props.issue}
//         </p>
//         <p className="mt-2 font-body text-sm leading-relaxed text-inkMuted">
//           “<PenAnnotation>{props.quote}</PenAnnotation>”
//         </p>
//         <p className="mt-2 flex items-start gap-1.5 font-mono text-xs leading-relaxed text-inkFaint">
//           <span aria-hidden="true" className="text-redpen">→</span>
//           {props.suggestion}
//         </p>
//       </div>
//     </div>
//   );
// } 

import type { ReactNode } from "react";
import PenAnnotation from "@/components/PenAnnotation";

type ReportCardProps =
  | { variant: "clear"; point: string; quote: string }
  | {
      variant: "gap";
      issue: string;
      quote: string;
      suggestion: string;
      children?: ReactNode;
    }
  | { variant: "contradiction"; firstQuote: string; laterQuote: string; explanation: string };

function CardShell({
  iconBg,
  iconColor,
  icon,
  children,
}: {
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface px-5 py-4">
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function ReportCard(props: ReportCardProps) {
  if (props.variant === "clear") {
    return (
      <CardShell
        iconBg="bg-brandSoft"
        iconColor="text-brand"
        icon={
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
        }
      >
        <p className="font-body text-[15px] font-semibold leading-snug text-ink">
          {props.point}
        </p>
        <p className="mt-1.5 font-body text-sm leading-relaxed text-inkMuted">
          “{props.quote}”
        </p>
      </CardShell>
    );
  }

  if (props.variant === "contradiction") {
    return (
      <CardShell
        iconBg="bg-redpenSoft"
        iconColor="text-redpen"
        icon={
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path
              d="M4 6 8 10 12 6 M4 11 8 15 12 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        <p className="font-body text-[15px] font-semibold leading-snug text-ink">
          Caught a contradiction
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <p className="rounded-lg bg-canvas px-3 py-2 font-body text-sm leading-relaxed text-inkMuted">
            <span className="font-mono text-xs text-inkFaint">first: </span>“{props.firstQuote}”
          </p>
          <p className="rounded-lg bg-canvas px-3 py-2 font-body text-sm leading-relaxed text-inkMuted">
            <span className="font-mono text-xs text-inkFaint">later: </span>“{props.laterQuote}”
          </p>
        </div>
        <p className="mt-2 font-mono text-xs leading-relaxed text-inkFaint">
          {props.explanation}
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell
      iconBg="bg-redpenSoft"
      iconColor="text-redpen"
      icon={
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
      }
    >
      <p className="font-body text-[15px] font-semibold leading-snug text-ink">{props.issue}</p>
      <p className="mt-2 font-body text-sm leading-relaxed text-inkMuted">
        “<PenAnnotation>{props.quote}</PenAnnotation>”
      </p>
      <p className="mt-2 flex items-start gap-1.5 font-mono text-xs leading-relaxed text-inkFaint">
        <span aria-hidden="true" className="text-redpen">→</span>
        {props.suggestion}
      </p>
      {props.children}
    </CardShell>
  );
}