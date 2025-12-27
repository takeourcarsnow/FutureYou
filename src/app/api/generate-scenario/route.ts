import { NextRequest, NextResponse } from 'next/server';
import {
  generateContent,
  createScenarioPrompt,
} from '@/lib/gemini';
import { GenerateScenarioRequest, GenerateScenarioResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScenarioRequest = await request.json();
    const { currentAge, stats, previousChoices, timelineContext } = body;

    const prompt = createScenarioPrompt(
      currentAge,
      stats,
      previousChoices,
      timelineContext
    );

    const responseText = await generateContent(prompt);
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const scenario = JSON.parse(jsonMatch[0]);

    // Validate and clean the response
    const response: GenerateScenarioResponse = {
      scenario: {
        title: scenario.title?.substring(0, 50) || 'Life Crossroads',
        description: scenario.description || 'You face an important decision.',
        context: scenario.context || 'Life has brought you to this moment.',
        choices: (scenario.choices || []).slice(0, 3).map((choice: any, index: number) => ({
          text: choice.text?.substring(0, 30) || `Option ${index + 1}`,
          description: choice.description || 'An interesting path forward.',
          riskLevel: ['low', 'medium', 'high'].includes(choice.riskLevel)
            ? choice.riskLevel
            : 'medium',
          potentialOutcomes: Array.isArray(choice.potentialOutcomes)
            ? choice.potentialOutcomes.slice(0, 3)
            : ['Unknown outcome'],
          category: ['money', 'health', 'career', 'relationships', 'life'].includes(
            choice.category
          )
            ? choice.category
            : 'life',
        })),
      },
    };

    // Ensure we have at least 2 choices
    while (response.scenario.choices.length < 2) {
      response.scenario.choices.push({
        text: 'Stay the course',
        description: 'Continue with your current path.',
        riskLevel: 'low',
        potentialOutcomes: ['Maintain stability'],
        category: 'life',
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generate scenario error:', error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', message: String(error) },
      { status: 500 }
    );
  }
}
