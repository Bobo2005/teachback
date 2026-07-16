
export default function LoadingState() {
  return (
    <div className="flex justify-start mb-8 items-center space-x-3 h-10 px-2 -rotate-1">
      <div className="w-2.5 h-2.5 rounded-full bg-chalkWhite/60 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2.5 h-2.5 rounded-full bg-chalkWhite/60 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2.5 h-2.5 rounded-full bg-chalkWhite/60 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}