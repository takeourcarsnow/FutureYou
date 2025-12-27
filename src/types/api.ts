// API request and response types

export interface GenerateScenarioRequest {
  currentAge: number;
  stats: {
    money: number;
    health: number;
    career: number;
    relationships: number;
  };
  previousChoices: string[];
  timelineContext: string;
}

export interface GenerateScenarioResponse {
  scenario: {
    title: string;
    description: string;
    context: string;
    choices: {
      text: string;
      description: string;
      riskLevel: 'low' | 'medium' | 'high';
      potentialOutcomes: string[];
      category: 'money' | 'health' | 'career' | 'relationships' | 'life';
    }[];
  };
}

export interface ProcessChoiceRequest {
  choice: {
    id: string;
    text: string;
    description: string;
    riskLevel: string;
    category: string;
  };
  currentAge: number;
  stats: {
    money: number;
    health: number;
    career: number;
    relationships: number;
  };
  timelineContext: string;
}

export interface ProcessChoiceResponse {
  outcome: {
    title: string;
    description: string;
    statChanges: {
      stat: string;
      change: number;
      reason: string;
    }[];
    impact: 'positive' | 'negative' | 'neutral';
    yearsToAdvance: number;
  };
}

export interface GenerateInsightsRequest {
  timeline: {
    year: number;
    title: string;
    impact: string;
  }[];
  finalStats: {
    money: number;
    health: number;
    career: number;
    relationships: number;
  };
  choices: string[];
}

export interface GenerateInsightsResponse {
  insights: string[];
  lifeScore: number;
  achievements: {
    title: string;
    description: string;
    rarity: string;
  }[];
}

export interface ApiError {
  message: string;
  code: string;
}
