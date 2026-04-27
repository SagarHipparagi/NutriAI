import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'NutriAI Predict',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { logs } = await req.json();

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    const system = `You are NutriAI Prediction Engine. Analyze user health logs and generate 3-4 predictions.
Respond ONLY with JSON array:
[
  { "icon": "⚡", "title": "Prediction Title", "desc": "Specific, data-driven prediction", "severity": "warn|info|ok|danger" }
]`;

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Analyze this 7-day health log and generate predictions: ${JSON.stringify(logs)}` },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const raw = completion.choices[0].message.content || '[]';
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim();
    const predictions = JSON.parse(clean);
    return NextResponse.json({ predictions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
