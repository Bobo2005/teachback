
import { NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { getReportSystemPrompt } from '@/lib/prompts';
import { ChatMessage } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { topic, transcript }: { topic: string; transcript: ChatMessage[] } = await req.json();

    if (!topic || !transcript || !Array.isArray(transcript)) {
      return NextResponse.json(
        { error: 'Topic and transcript array are required.' },
        { status: 400 }
      );
    }

    // Format the conversation history for the AI to read easily
    const formattedTranscript = transcript
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const promptContent = `Topic: ${topic}\n\nTranscript:\n${formattedTranscript}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: getReportSystemPrompt(),
      messages: [
        { role: 'user', content: promptContent }
      ],
    });

    const firstBlock = response.content[0];
    let replyText = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    // Defensively strip markdown formatting if the model disobeys instructions
    replyText = replyText.trim();
    if (replyText.startsWith('```')) {
      replyText = replyText.replace(/^
http://googleusercontent.com/immersive_entry_chip/0

You should receive a structured JSON response matching the `UnderstandingReport` type, cleanly parsed and ready for the frontend.