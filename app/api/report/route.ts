
// import { NextResponse } from 'next/server';
// import anthropic from '@/lib/anthropic';
// import { getReportSystemPrompt } from '@/lib/prompts';
// import { ChatMessage } from '@/lib/types';

// export async function POST(req: Request) {
//   try {
//     const { topic, transcript }: { topic: string; transcript: ChatMessage[] } = await req.json();

//     if (!topic || !transcript || !Array.isArray(transcript)) {
//       return NextResponse.json(
//         { error: 'Topic and transcript array are required.' },
//         { status: 400 }
//       );
//     }

//     // Format the conversation history for the AI to read easily
//     const formattedTranscript = transcript
//       .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
//       .join('\n\n');

//     const promptContent = `Topic: ${topic}\n\nTranscript:\n${formattedTranscript}`;

//     const response = await anthropic.messages.create({
//       model: 'claude-sonnet-4-6',
//       max_tokens: 1500,
//       system: getReportSystemPrompt(),
//       messages: [
//         { role: 'user', content: promptContent }
//       ],
//     });

//     const firstBlock = response.content[0];
//     let replyText = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

//     // Defensively strip markdown formatting if the model disobeys instructions
//     replyText = replyText.trim();
//     if (replyText.startsWith('```')) {
//       replyText = replyText.replace(/^
// http://googleusercontent.com/immersive_entry_chip/0

// You should receive a structured JSON response matching the `UnderstandingReport` type, cleanly parsed and ready for the frontend.

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
    } catch (parseErr) {
      console.error("Failed to parse report JSON:", parseErr, "Raw text:", rawText);
      return NextResponse.json(
        {
          error:
            "The model's response wasn't valid JSON, so the report couldn't be generated. Please try again.",
        },
        { status: 500 }
      );
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