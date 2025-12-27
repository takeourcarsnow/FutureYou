import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: modelName,
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content');
  }
}

export function createScenarioPrompt(
  currentAge: number,
  stats: { money: number; health: number; career: number; relationships: number },
  previousChoices: string[],
  timelineContext: string
): string {
  return `You are a life simulation AI. Generate a realistic life scenario for someone.

Current situation:
- Age: ${currentAge} years old
- Financial stability: ${stats.money}/100 (${getStatDescription(stats.money, 'money')})
- Health: ${stats.health}/100 (${getStatDescription(stats.health, 'health')})
- Career progress: ${stats.career}/100 (${getStatDescription(stats.career, 'career')})
- Relationships: ${stats.relationships}/100 (${getStatDescription(stats.relationships, 'relationships')})

Previous life choices:
${previousChoices.length > 0 ? previousChoices.map((c, i) => `${i + 1}. ${c}`).join('\n') : 'None yet - this is the start of their journey'}

Timeline context:
${timelineContext || 'Starting fresh'}

Generate a life scenario with EXACTLY 3 meaningful choices. The scenario should be:
- Age-appropriate and realistic
- Affected by their current stats
- Have potential for both positive and negative outcomes
- Be engaging and thought-provoking

Respond ONLY with valid JSON in this exact format:
{
  "title": "Scenario title (max 50 chars)",
  "description": "Detailed scenario description (2-3 sentences)",
  "context": "Background context that led to this situation (1-2 sentences)",
  "choices": [
    {
      "text": "Choice label (max 30 chars)",
      "description": "What this choice means (1 sentence)",
      "riskLevel": "low|medium|high",
      "potentialOutcomes": ["Possible outcome 1", "Possible outcome 2"],
      "category": "money|health|career|relationships|life"
    }
  ]
}`;
}

export function createOutcomePrompt(
  choice: { text: string; description: string; riskLevel: string; category: string },
  currentAge: number,
  stats: { money: number; health: number; career: number; relationships: number },
  timelineContext: string
): string {
  return `You are a life simulation AI determining the outcome of a life choice.

The person chose: "${choice.text}"
Choice details: ${choice.description}
Risk level: ${choice.riskLevel}
Category: ${choice.category}

Current situation:
- Age: ${currentAge}
- Financial stability: ${stats.money}/100
- Health: ${stats.health}/100
- Career progress: ${stats.career}/100
- Relationships: ${stats.relationships}/100

Context: ${timelineContext}

Generate a realistic outcome for this choice. Consider:
- Higher risk choices should have more variable outcomes
- Outcomes should logically follow from the choice
- Include both immediate and implied future effects
- Be realistic but not overly negative

Respond ONLY with valid JSON:
{
  "title": "Outcome title (max 50 chars)",
  "description": "What happened as a result (2-3 sentences, narrative style)",
  "statChanges": [
    {"stat": "money|health|career|relationships", "change": -20 to +20, "reason": "Brief reason"}
  ],
  "impact": "positive|negative|neutral",
  "yearsToAdvance": 1-5
}

Important:
- "change" values should be between -20 and +20
- Higher risk choices can have larger stat changes
- Include 1-4 stat changes that make sense for the choice
- yearsToAdvance should be 1-5 years based on the significance`;
}

export function createInsightsPrompt(
  timeline: { year: number; title: string; impact: string }[],
  finalStats: { money: number; health: number; career: number; relationships: number },
  choices: string[]
): string {
  return `You are a wise life advisor analyzing someone's life simulation results.

Life timeline:
${timeline.map((e) => `- Year ${e.year}: ${e.title} (${e.impact})`).join('\n')}

Final life stats at end of simulation:
- Financial stability: ${finalStats.money}/100
- Health: ${finalStats.health}/100
- Career progress: ${finalStats.career}/100
- Relationships: ${finalStats.relationships}/100

Key choices made:
${choices.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Provide thoughtful insights about this simulated life. Generate:
1. 3-5 meaningful life insights/lessons from their journey
2. A life score (0-100) based on overall life satisfaction
3. 2-4 achievements they earned

Respond ONLY with valid JSON:
{
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "lifeScore": 75,
  "achievements": [
    {"title": "Achievement name", "description": "What they did to earn it", "rarity": "common|rare|epic|legendary"}
  ]
}`;
}

function getStatDescription(value: number, stat: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    money: {
      high: 'financially secure',
      medium: 'getting by',
      low: 'struggling financially',
    },
    health: {
      high: 'excellent health',
      medium: 'decent health',
      low: 'health concerns',
    },
    career: {
      high: 'thriving career',
      medium: 'steady job',
      low: 'career challenges',
    },
    relationships: {
      high: 'strong connections',
      medium: 'some close friends',
      low: 'feeling isolated',
    },
  };

  const level = value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low';
  return descriptions[stat]?.[level] || 'unknown';
}
