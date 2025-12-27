// User profile and simulation state types

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatarSeed: string;
  createdAt: Date;
}

export interface LifeStats {
  money: number;        // 0-100 scale
  health: number;       // 0-100 scale
  career: number;       // 0-100 scale
  relationships: number; // 0-100 scale
  happiness: number;    // 0-100 scale (derived)
}

export interface StatChange {
  stat: keyof Omit<LifeStats, 'happiness'>;
  change: number;
  reason: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  age: number;
  title: string;
  description: string;
  category: 'money' | 'health' | 'career' | 'relationships' | 'life';
  impact: 'positive' | 'negative' | 'neutral';
  statChanges: StatChange[];
  choiceMade?: Choice;
  imagePrompt?: string;
}

export interface Choice {
  id: string;
  text: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialOutcomes: string[];
  category: 'money' | 'health' | 'career' | 'relationships' | 'life';
}

export interface LifeScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  choices: Choice[];
  currentAge: number;
  currentStats: LifeStats;
}

export interface SimulationState {
  profile: UserProfile | null;
  currentAge: number;
  startAge: number;
  targetAge: number;
  stats: LifeStats;
  timeline: TimelineEvent[];
  currentScenario: LifeScenario | null;
  regretMeter: number;  // 0-100
  rewardMeter: number;  // 0-100
  isSimulating: boolean;
  simulationComplete: boolean;
}

export interface BranchingTimeline {
  id: string;
  name: string;
  divergencePoint: number; // Year when this branch started
  timeline: TimelineEvent[];
  finalStats: LifeStats;
  regretMeter: number;
  rewardMeter: number;
}

export interface SimulationResult {
  mainTimeline: TimelineEvent[];
  alternativeTimelines: BranchingTimeline[];
  finalStats: LifeStats;
  lifeScore: number;
  achievements: Achievement[];
  insights: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number; // Age when unlocked
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
