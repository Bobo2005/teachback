import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getPersonaSystemPrompt } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { topic, history } = (await req.json()) as {
      topic: string;
      history: ChatMessage[];
    };

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Request body must include a non-empty `topic` string." },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] =
      history && history.length > 0
        ? history
        : [
            {
              role: "user",
              content: "Let's begin — I'm ready to teach you about this.",
            },
          ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: getPersonaSystemPrompt(topic),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error calling Anthropic API.";
    return NextResponse.json(
      { error: `Chat request failed: ${message}` },
      { status: 500 }
    );
  }
}