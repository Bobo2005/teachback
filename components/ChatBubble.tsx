import type { ChatMessage } from "@/lib/types";

export default function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "assistant") {
    return (
      <div className="flex w-full justify-start">
        <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3 font-body text-[15px] leading-relaxed text-ink shadow-sm sm:max-w-[70%]">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-3 font-body text-[15px] leading-relaxed text-white shadow-sm sm:max-w-[70%]">
        {message.content}
      </p>
    </div>
  );
}