

export default function LoadingState({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className="flex items-center gap-3 py-2 pl-1"
    >
      <div aria-hidden="true" className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50" />
      </div>
      {label && (
        <span aria-hidden="true" className="font-annotation text-lg text-chalkWhite/60">
          {label}
        </span>
      )}
    </div>
  );
}