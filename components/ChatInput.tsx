"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-t-md bg-boardPanel px-4 py-3 shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.5)] sm:px-6 sm:py-4"
    >
      <label htmlFor="chat-input" className="sr-only">
        Explain your topic
      </label>
      <textarea
        id="chat-input"
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Keep explaining…"
        className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-sm bg-board/60 px-4 py-2.5 font-body text-base text-chalkWhite placeholder:text-chalkWhite/40 outline-none ring-1 ring-chalkWhite/10 transition focus:ring-chalkBlue/60 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="shrink-0 rounded-sm bg-chalkBlue px-5 py-2.5 font-body text-sm font-semibold tracking-wide text-board transition hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}