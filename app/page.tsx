
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (topic.trim()) {
      localStorage.setItem('teachback_topic', topic.trim());
      router.push('/teach');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-board">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-16">
        
        {/* Headline */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-chalkWhite text-center leading-tight tracking-tight">
          Explain it.<br />We'll catch what you missed.
        </h1>

        {/* Input Form */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-lg flex flex-col space-y-8"
        >
          <div className="flex flex-col space-y-3">
            <label 
              htmlFor="topic" 
              className="font-annotation text-chalkWhite text-3xl md:text-4xl px-2 rotate-[-1deg]"
            >
              What do you want to teach me?
            </label>
            
            {/* Paper Card Input */}
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, The French Revolution..."
              className="w-full bg-paper text-ink font-body text-lg p-5 rounded shadow-lg focus:outline-none focus:ring-4 focus:ring-chalkBlue/50 transition-all placeholder:text-ink/40"
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-chalkBlue text-board font-display font-semibold text-2xl py-4 rounded shadow-md hover:bg-chalkBlue/90 hover:scale-[1.02] transition-transform active:scale-95"
          >
            Start Teaching
          </button>
        </form>

      </div>
    </main>
  );
}