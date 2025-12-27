import { NextRequest, NextResponse } from 'next/server';
import {
  generateContent,
  createOutcomePrompt,
} from '@/lib/gemini';
import { ProcessChoiceRequest, ProcessChoiceResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ProcessChoiceRequest = await request.json();
    const { choice, currentAge, stats, timelineContext } = body;

    const prompt = createOutcomePrompt(
      choice,
      currentAge,
      stats,
      timelineContext
    );

    const responseText = await generateContent(prompt);
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const outcome = JSON.parse(jsonMatch[0]);

    // Validate and clamp stat changes
    const validStats = ['money', 'health', 'career', 'relationships'];
    const statChanges = (outcome.statChanges || [])
      .filter((sc: any) => validStats.includes(sc.stat))
      .map((sc: any) => ({
        stat: sc.stat,
        change: Math.max(-20, Math.min(20, Number(sc.change) || 0)),
        reason: sc.reason || 'Life happened',
      }));

    // Ensure at least one stat change
    if (statChanges.length === 0) {
      statChanges.push({
        stat: choice.category === 'life' ? 'relationships' : choice.category,
        change: outcome.impact === 'positive' ? 5 : outcome.impact === 'negative' ? -5 : 0,
        reason: 'The result of your choice',
      });
    }

    const response: ProcessChoiceResponse = {
      outcome: {
        title: outcome.title?.substring(0, 50) || 'The Outcome',
        description: outcome.description || 'Your choice has shaped your path.',
        statChanges,
        impact: ['positive', 'negative', 'neutral'].includes(outcome.impact)
          ? outcome.impact
          : 'neutral',
        yearsToAdvance: Math.max(1, Math.min(5, Number(outcome.yearsToAdvance) || 2)),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Process choice error:', error);
    return NextResponse.json(
      { error: 'Failed to process choice', message: String(error) },
      { status: 500 }
    );
  }
}
