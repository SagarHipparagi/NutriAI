import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'NutriAI Planner',
  },
});

const SYSTEM = `You are NutriAI Meal Planner. Generate a realistic, Indian-food-heavy weekly meal plan.
Respond ONLY with valid JSON in this exact format:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        { "time": "Breakfast", "name": "Dish name", "kcal": 380, "protein": 22, "tags": ["High Protein"] },
        { "time": "Lunch", "name": "...", "kcal": 520, "protein": 20, "tags": ["Balanced"] },
        { "time": "Snack", "name": "...", "kcal": 150, "protein": 8, "tags": ["Light"] },
        { "time": "Dinner", "name": "...", "kcal": 560, "protein": 35, "tags": ["High Protein"] }
      ]
    }
  ],
  "grocery": {
    "Proteins": ["item1", "item2"],
    "Grains & Carbs": ["item1"],
    "Vegetables": ["item1"],
    "Fruits": ["item1"],
    "Pantry": ["item1"]
  }
}
Include exactly 3 days. Tailor to the user's goal, budget, and preference.`;

export async function POST(req: NextRequest) {
  try {
    const { goal, budget, preference } = await req.json();

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    const prompt = `Generate a 3-day Indian meal plan for: Goal=${goal}, Budget=${budget}, Preference=${preference}. Focus on Indian dishes with some global options.`;

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const raw = completion.choices[0].message.content || '{}';
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim();
    const plan = JSON.parse(clean);
    return NextResponse.json({ plan });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
