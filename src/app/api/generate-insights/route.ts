import { NextRequest, NextResponse } from 'next/server';
import {
  generateContent,
  createInsightsPrompt,
} from '@/lib/gemini';
import { GenerateInsightsRequest, GenerateInsightsResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateInsightsRequest = await request.json();
    const { timeline, finalStats, choices } = body;

    const prompt = createInsightsPrompt(timeline, finalStats, choices);

    const responseText = await generateContent(prompt);
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const insights = JSON.parse(jsonMatch[0]);

    // Validate the response
    const response: GenerateInsightsResponse = {
      insights: Array.isArray(insights.insights)
        ? insights.insights.slice(0, 5)
        : ['Your journey was unique.'],
      lifeScore: Math.max(0, Math.min(100, Number(insights.lifeScore) || 50)),
      achievements: Array.isArray(insights.achievements)
        ? insights.achievements.slice(0, 4).map((a: any) => ({
            title: a.title || 'Life Experience',
            description: a.description || 'You lived and learned.',
            rarity: ['common', 'rare', 'epic', 'legendary'].includes(a.rarity)
              ? a.rarity
              : 'common',
          }))
        : [],
    };

    // Ensure at least one insight
    if (response.insights.length === 0) {
      response.insights = ['Every choice matters in the grand scheme of life.'];
    }

    // Ensure at least one achievement
    if (response.achievements.length === 0) {
      response.achievements = [
        {
          title: 'Life Explorer',
          description: 'Completed the life simulation',
          rarity: 'common',
        },
      ];
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generate insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights', message: String(error) },
      { status: 500 }
    );
  }
}
