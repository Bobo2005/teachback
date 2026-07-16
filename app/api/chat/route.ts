// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { getPersonaSystemPrompt } from '@/lib/prompts';
import { ChatMessage } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { topic, history }: { topic: string; history: ChatMessage[] } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required.' },
        { status: 400 }
      );
    }

    // Default to an initial opening trigger if no conversation history exists
    const messages = history && history.length > 0 
      ? history 
      : [{ role: 'user' as const, content: "Let's begin — I'm ready to teach you about this." }];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: getPersonaSystemPrompt(topic),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    // Extract the text safely from the first content block
    const firstBlock = response.content[0];
    const reply = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the chat response.' },
      { status: 500 }
    );
  }
}