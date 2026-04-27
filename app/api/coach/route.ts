import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'NutriAI Coach',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return NextResponse.json({ reply: "⚠️ Please set your OPENROUTER_API_KEY in .env.local to activate the AI coach." });
    }

    const systemPrompt = `You are NutriAI Coach — a warm, knowledgeable, and proactive personal nutritionist AI.
You are context-aware and always reference the user's actual data from the past 7 days.
Never be generic. Always be specific, actionable, and empathetic.
Keep responses concise (2-4 sentences max unless explaining something complex).
Use emojis sparingly for warmth. Speak like a trusted friend who happens to be a nutritionist.

USER CONTEXT (last 7 days):
${context}`;

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const reply = completion.choices[0].message.content || "I'm having trouble right now. Please try again.";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ reply: `Error: ${e.message}` }, { status: 500 });
  }
}
