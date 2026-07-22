import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getPracticeQuestionsSystemPrompt } from "@/lib/prompts";
import type { Gap, PracticeQuestion } from "@/lib/types";

/** Strip ```json / ``` code fences the model may wrap its output in. */
function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

/** Last-resort extraction of the first balanced {...} object in the text. */
function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function isValidQuestions(value: unknown): value is { questions: PracticeQuestion[] } {
  if (typeof value !== "object" || value === null) return false;
  const v = value as { questions?: unknown };
  if (!Array.isArray(v.questions) || v.questions.length === 0) return false;
  return v.questions.every(
    (q): q is PracticeQuestion =>
      typeof q === "object" &&
      q !== null &&
      typeof (q as PracticeQuestion).question === "string" &&
      Array.isArray((q as PracticeQuestion).options) &&
      (q as PracticeQuestion).options.length === 4 &&
      typeof (q as PracticeQuestion).correctIndex === "number" &&
      (q as PracticeQuestion).correctIndex >= 0 &&
      (q as PracticeQuestion).correctIndex <= 3 &&
      typeof (q as PracticeQuestion).explanation === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    const { topic, gap } = (await req.json()) as { topic: string; gap: Gap };

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Request body must include a non-empty `topic` string." },
        { status: 400 }
      );
    }
    if (!gap || typeof gap.issue !== "string" || typeof gap.quote !== "string") {
      return NextResponse.json(
        { error: "Request body must include a `gap` object with issue and quote." },
        { status: 400 }
      );
    }

    const userMessage = `Topic: ${topic}

Gap to drill:
Issue: ${gap.issue}
What they said: "${gap.quote}"
What to review: ${gap.suggestion}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: getPracticeQuestionsSystemPrompt(),
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    const cleaned = stripCodeFences(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const extracted = extractJsonObject(cleaned);
      if (!extracted) {
        console.error("Failed to parse practice JSON, no object found. Raw text:", rawText);
        return NextResponse.json(
          { error: "The model's response wasn't valid JSON. Please try again." },
          { status: 500 }
        );
      }
      try {
        parsed = JSON.parse(extracted);
      } catch (parseErr) {
        console.error("Failed to parse extracted practice JSON:", parseErr, "Raw text:", rawText);
        return NextResponse.json(
          { error: "The model's response wasn't valid JSON. Please try again." },
          { status: 500 }
        );
      }
    }

    if (!isValidQuestions(parsed)) {
      console.error("Practice JSON parsed but didn't match expected shape:", parsed);
      return NextResponse.json(
        { error: "The generated quiz wasn't in the expected format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("POST /api/practice failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error calling Anthropic API.";
    return NextResponse.json(
      { error: `Practice request failed: ${message}` },
      { status: 500 }
    );
  }
}