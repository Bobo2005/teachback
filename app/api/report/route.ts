import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getReportSystemPrompt } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

function formatTranscript(transcript: ChatMessage[]): string {
  return transcript
    .map((m) => `${m.role === "user" ? "Teacher (user)" : "Student (AI)"}: ${m.content}`)
    .join("\n\n");
}

/** Strip ```json / ``` code fences the model may wrap its output in. */
function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

/**
 * Last-resort extraction: if the model still wrapped the JSON in prose
 * (e.g. "I'll explain this...\n\n{ ... }"), pull out the first balanced
 * {...} object in the text instead of giving up.
 */
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

export async function POST(req: NextRequest) {
  try {
    const { topic, transcript } = (await req.json()) as {
      topic: string;
      transcript: ChatMessage[];
    };

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Request body must include a non-empty `topic` string." },
        { status: 400 }
      );
    }
    if (!Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `transcript` array." },
        { status: 400 }
      );
    }

    const userMessage = `Topic: ${topic}\n\nTranscript:\n\n${formatTranscript(transcript)}`;

    // Note: assistant-turn prefill (starting the reply with "{") isn't
    // supported on this model — the conversation must end on a user turn.
    // So we rely on a strict system prompt plus defensive parsing below.
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: getReportSystemPrompt(),
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    const cleaned = stripCodeFences(rawText);

    let report: unknown;
    try {
      report = JSON.parse(cleaned);
    } catch {
      // Fallback: the model added stray prose around the object (e.g.
      // "I'll explain this...\n\n{ ... }"). Try to pull out the JSON
      // object itself before giving up entirely.
      const extracted = extractJsonObject(cleaned);
      if (extracted) {
        try {
          report = JSON.parse(extracted);
        } catch (parseErr) {
          console.error("Failed to parse extracted report JSON:", parseErr, "Raw text:", rawText);
          return NextResponse.json(
            {
              error:
                "The model's response wasn't valid JSON, so the report couldn't be generated. Please try again.",
            },
            { status: 500 }
          );
        }
      } else {
        console.error("Failed to parse report JSON, no object found. Raw text:", rawText);
        return NextResponse.json(
          {
            error:
              "The model's response wasn't valid JSON, so the report couldn't be generated. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(report);
  } catch (err) {
    console.error("POST /api/report failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error calling Anthropic API.";
    return NextResponse.json(
      { error: `Report request failed: ${message}` },
      { status: 500 }
    );
  }
}