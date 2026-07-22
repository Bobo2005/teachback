"use client";

import { useState } from "react";
import type { PracticeAnswer, PracticeQuestion, PracticeResult } from "@/lib/types";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function PracticeQuiz({
  questions,
  onComplete,
}: {
  questions: PracticeQuestion[];
  onComplete: (result: PracticeResult) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  function handleNext() {
    if (selected === null) return;
    const answer: PracticeAnswer = {
      questionIndex: index,
      selectedIndex: selected,
      correct: selected === current.correctIndex,
    };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setSelected(null);

    if (isLast) {
      const score = nextAnswers.filter((a) => a.correct).length;
      setFinished(true);
      onComplete({
        questions,
        answers: nextAnswers,
        score,
        total: questions.length,
      });
    } else {
      setIndex(index + 1);
    }
  }

  if (finished) {
    const score = answers.filter((a) => a.correct).length;
    return (
      <div className="rounded-lg border border-border bg-canvas px-4 py-4">
        <p className="font-body text-sm font-semibold text-ink">
          Scored {score} / {questions.length}
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {questions.map((q, i) => {
            const answer = answers[i];
            return (
              <div key={i} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                <p className="font-body text-sm text-ink">{q.question}</p>
                <p
                  className={`mt-1 font-body text-sm ${
                    answer.correct ? "text-brandDark" : "text-redpen"
                  }`}
                >
                  {OPTION_LABELS[answer.selectedIndex]}. {q.options[answer.selectedIndex]}
                  {answer.correct ? " — correct" : ""}
                </p>
                {!answer.correct && (
                  <p className="mt-0.5 font-body text-sm text-brandDark">
                    {OPTION_LABELS[q.correctIndex]}. {q.options[q.correctIndex]} — correct
                  </p>
                )}
                <p className="mt-1 font-mono text-xs leading-relaxed text-inkFaint">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-canvas px-4 py-4">
      <p className="font-mono text-xs text-inkFaint">
        Question {index + 1} of {questions.length}
      </p>
      <p className="mt-2 font-body text-sm font-semibold text-ink">{current.question}</p>

      <div className="mt-3 flex flex-col gap-2">
        {current.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left font-body text-sm transition ${
              selected === i
                ? "border-brand bg-brandSoft text-ink"
                : "border-border bg-surface text-inkMuted hover:border-brand/50"
            }`}
          >
            <span className="font-mono text-xs font-semibold text-inkFaint">
              {OPTION_LABELS[i]}
            </span>
            {option}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={selected === null}
        className="mt-4 rounded-lg bg-brand px-5 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}