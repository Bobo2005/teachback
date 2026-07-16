import type { ChatMessage } from "@/lib/types";

export default function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "assistant") {
    return (
      <div className="flex w-full justify-start">
        <p className="max-w-[85%] font-annotation text-2xl leading-snug text-chalkWhite sm:max-w-[75%] sm:text-3xl">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end">
      <p className="max-w-[85%] -rotate-1 rounded-sm bg-paper px-5 py-3 font-body text-base leading-relaxed text-ink shadow-[0_6px_0_-2px_rgba(0,0,0,0.15),0_12px_20px_-10px_rgba(0,0,0,0.45)] sm:max-w-[70%]">
        {message.content}
      </p>
    </div>
  );
}