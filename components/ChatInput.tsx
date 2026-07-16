
import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-boardPanel px-4 py-5 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-10"
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Explain your thought..."
          className="flex-1 bg-paper text-ink font-body text-lg rounded px-5 py-3 shadow-inner focus:outline-none focus:ring-4 focus:ring-chalkBlue/50 disabled:opacity-70 transition-all placeholder:text-ink/40"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-chalkBlue text-board font-display font-semibold text-lg px-8 py-3 rounded shadow hover:bg-chalkBlue/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          Send
        </button>
      </div>
    </form>
  );
}