import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'NutriAI',
  },
});

const SYSTEM_PROMPT = `You are NutriAI Food Analyzer — a world-class nutritionist AI trained on Indian and global cuisine.
When given a food description (or image context), respond with a JSON object ONLY (no markdown) with this exact structure:
{
  "name": "Full dish name",
  "cuisine": "🇮🇳 North Indian" (use flag emoji + region),
  "calories": 520,
  "protein": 22,
  "carbs": 78,
  "fat": 11,
  "fiber": 8,
  "healthScore": 76,
  "swaps": [
    { "item": "Replace X with Y", "benefit": "Reduces Z by N%" }
  ],
  "insights": [
    "Insight about this meal for the user's health"
  ],
  "sustainability": "Brief eco impact description"
}
Be accurate. Indian dishes recognized: dal, sabzi, roti, rice varieties, biryani, etc.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, image } = body;

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (image) {
      messages.push({
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: image } },
          { type: 'text', text: 'Analyze this meal and respond with the JSON structure.' },
        ],
      });
    } else {
      messages.push({ role: 'user', content: `Analyze this meal: ${text}` });
    }

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages,
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = completion.choices[0].message.content || '{}';
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(clean);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
