import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  SimulationState,
  UserProfile,
  LifeStats,
  TimelineEvent,
  LifeScenario,
  Choice,
  StatChange,
} from '@/types';
import { generateId } from '@/lib/utils';

interface SimulationStore extends SimulationState {
  // Profile actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;

  // Simulation control
  startSimulation: (startAge: number, targetAge: number) => void;
  resetSimulation: () => void;
  setSimulating: (isSimulating: boolean) => void;
  completeSimulation: () => void;

  // Stats actions
  updateStats: (changes: StatChange[]) => void;
  setStats: (stats: LifeStats) => void;

  // Timeline actions
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  setTimeline: (timeline: TimelineEvent[]) => void;

  // Scenario actions
  setCurrentScenario: (scenario: LifeScenario | null) => void;

  // Age actions
  advanceAge: (years: number) => void;
  setCurrentAge: (age: number) => void;

  // Meters
  updateRegretMeter: (change: number) => void;
  updateRewardMeter: (change: number) => void;

  // Choice processing
  processChoice: (choice: Choice, outcome: {
    title: string;
    description: string;
    statChanges: StatChange[];
    impact: 'positive' | 'negative' | 'neutral';
  }) => void;
}

const initialStats: LifeStats = {
  money: 50,
  health: 80,
  career: 40,
  relationships: 60,
  happiness: 60,
};

const initialState: SimulationState = {
  profile: null,
  currentAge: 25,
  startAge: 25,
  targetAge: 65,
  stats: initialStats,
  timeline: [],
  currentScenario: null,
  regretMeter: 0,
  rewardMeter: 0,
  isSimulating: false,
  simulationComplete: false,
};

const calculateHappiness = (stats: LifeStats): number => {
  const { money, health, career, relationships } = stats;
  // Weighted average with health and relationships having more weight
  return Math.round(
    money * 0.2 + health * 0.3 + career * 0.2 + relationships * 0.3
  );
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      clearProfile: () => set({ profile: null }),

      startSimulation: (startAge, targetAge) =>
        set({
          currentAge: startAge,
          startAge,
          targetAge,
          stats: initialStats,
          timeline: [],
          currentScenario: null,
          regretMeter: 0,
          rewardMeter: 0,
          isSimulating: true,
          simulationComplete: false,
        }),

      resetSimulation: () => set(initialState),

      setSimulating: (isSimulating) => set({ isSimulating }),

      completeSimulation: () =>
        set({ isSimulating: false, simulationComplete: true }),

      updateStats: (changes) =>
        set((state) => {
          const newStats = { ...state.stats };
          changes.forEach(({ stat, change }) => {
            if (stat !== 'happiness') {
              newStats[stat] = clamp(newStats[stat] + change, 0, 100);
            }
          });
          newStats.happiness = calculateHappiness(newStats);
          return { stats: newStats };
        }),

      setStats: (stats) =>
        set({
          stats: {
            ...stats,
            happiness: calculateHappiness(stats),
          },
        }),

      addTimelineEvent: (event) =>
        set((state) => ({
          timeline: [
            ...state.timeline,
            { ...event, id: generateId() },
          ],
        })),

      setTimeline: (timeline) => set({ timeline }),

      setCurrentScenario: (scenario) => set({ currentScenario: scenario }),

      advanceAge: (years) =>
        set((state) => ({
          currentAge: state.currentAge + years,
        })),

      setCurrentAge: (age) => set({ currentAge: age }),

      updateRegretMeter: (change) =>
        set((state) => ({
          regretMeter: clamp(state.regretMeter + change, 0, 100),
        })),

      updateRewardMeter: (change) =>
        set((state) => ({
          rewardMeter: clamp(state.rewardMeter + change, 0, 100),
        })),

      processChoice: (choice, outcome) => {
        const state = get();
        const currentYear = new Date().getFullYear() + (state.currentAge - state.startAge);

        // Create timeline event
        const event: Omit<TimelineEvent, 'id'> = {
          year: currentYear,
          age: state.currentAge,
          title: outcome.title,
          description: outcome.description,
          category: choice.category,
          impact: outcome.impact,
          statChanges: outcome.statChanges,
          choiceMade: choice,
        };

        // Update meters based on impact
        let regretChange = 0;
        let rewardChange = 0;

        if (outcome.impact === 'positive') {
          rewardChange = 10 + Math.floor(Math.random() * 10);
        } else if (outcome.impact === 'negative') {
          regretChange = 10 + Math.floor(Math.random() * 10);
        }

        set((state) => ({
          timeline: [...state.timeline, { ...event, id: generateId() }],
          regretMeter: clamp(state.regretMeter + regretChange, 0, 100),
          rewardMeter: clamp(state.rewardMeter + rewardChange, 0, 100),
          currentScenario: null,
        }));

        // Update stats
        get().updateStats(outcome.statChanges);
      },
    }),
    {
      name: 'future-you-simulation',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        timeline: state.timeline,
        stats: state.stats,
        currentAge: state.currentAge,
        startAge: state.startAge,
        targetAge: state.targetAge,
        regretMeter: state.regretMeter,
        rewardMeter: state.rewardMeter,
        simulationComplete: state.simulationComplete,
      }),
    }
  )
);
