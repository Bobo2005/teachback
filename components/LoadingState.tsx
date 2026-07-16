export default function LoadingState() {
  return (
    <div
      role="status"
      aria-label="The student is thinking"
      className="flex items-center gap-1.5 py-2 pl-1"
    >
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-chalkWhite/50" />
    </div>
  );
}