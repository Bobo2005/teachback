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
      className="flex items-end gap-3 border-t border-border bg-surface px-4 py-3 sm:px-6 sm:py-4"
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
        className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-lg border border-border bg-canvas px-4 py-2.5 font-body text-[15px] text-ink placeholder:text-inkFaint outline-none transition focus:border-brand disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="shrink-0 rounded-lg bg-brand px-5 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}