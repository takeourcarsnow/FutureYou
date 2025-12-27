'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import {
  Card,
  Button,
  Input,
  Select,
  Slider,
  LoadingScreen,
  Avatar,
  AvatarTransition,
} from '@/components/ui';
import { DualMeter } from '@/components/ui/Meter';
import {
  StatsDisplay,
  ScenarioDisplay,
  TimelineMini,
  ResultsScreen,
  OutcomeDisplay,
} from '@/components/game';
import { useSimulationStore } from '@/store';
import { Choice, LifeScenario, Achievement } from '@/types';
import { generateId } from '@/lib/utils';
import { ArrowRight, User, Calendar, Sparkles } from 'lucide-react';

type SimulationPhase = 'setup' | 'playing' | 'outcome' | 'results';

export default function SimulatePage() {
  const store = useSimulationStore();
  const [phase, setPhase] = useState<SimulationPhase>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [lifeScore, setLifeScore] = useState(0);

  // Setup form state
  const [name, setName] = useState(store.profile?.name || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    store.profile?.gender || 'other'
  );
  const [startAge, setStartAge] = useState(store.startAge || 25);
  const [targetAge, setTargetAge] = useState(store.targetAge || 65);

  // Check for existing simulation
  useEffect(() => {
    if (store.profile && store.timeline.length > 0 && !store.simulationComplete) {
      setPhase('playing');
    } else if (store.simulationComplete) {
      setPhase('results');
    }
  }, []);

  const generateScenario = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Generating your next life scenario...');

    try {
      const previousChoices = store.timeline
        .filter((e) => e.choiceMade)
        .map((e) => e.choiceMade!.text);

      const timelineContext = store.timeline
        .slice(-3)
        .map((e) => `${e.title}: ${e.description}`)
        .join(' ');

      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAge: store.currentAge,
          stats: {
            money: store.stats.money,
            health: store.stats.health,
            career: store.stats.career,
            relationships: store.stats.relationships,
          },
          previousChoices,
          timelineContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate scenario');

      const data = await response.json();
      const scenario: LifeScenario = {
        id: generateId(),
        title: data.scenario.title,
        description: data.scenario.description,
        context: data.scenario.context,
        choices: data.scenario.choices.map((c: any) => ({
          ...c,
          id: generateId(),
        })),
        currentAge: store.currentAge,
        currentStats: store.stats,
      };

      store.setCurrentScenario(scenario);
    } catch (error) {
      console.error('Error generating scenario:', error);
      // Fallback scenario
      store.setCurrentScenario({
        id: generateId(),
        title: 'A Crossroads Moment',
        description: 'Life presents you with an important decision.',
        context: 'Your choices will shape your future.',
        choices: [
          {
            id: generateId(),
            text: 'Take the safe path',
            description: 'A conservative choice with predictable outcomes.',
            riskLevel: 'low',
            potentialOutcomes: ['Stability', 'Steady progress'],
            category: 'life',
          },
          {
            id: generateId(),
            text: 'Take a calculated risk',
            description: 'A balanced approach with moderate uncertainty.',
            riskLevel: 'medium',
            potentialOutcomes: ['Potential growth', 'Some challenges'],
            category: 'career',
          },
          {
            id: generateId(),
            text: 'Go all in',
            description: 'A bold move that could change everything.',
            riskLevel: 'high',
            potentialOutcomes: ['Major success', 'Significant setback'],
            category: 'money',
          },
        ],
        currentAge: store.currentAge,
        currentStats: store.stats,
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [store]);

  const handleStartSimulation = () => {
    const avatarSeed = generateId();
    store.setProfile({
      id: generateId(),
      name: name || 'Anonymous',
      age: startAge,
      gender,
      avatarSeed,
      createdAt: new Date(),
    });
    store.startSimulation(startAge, targetAge);
    setPhase('playing');
    generateScenario();
  };

  const handleChoiceSelect = async (choice: Choice) => {
    setIsLoading(true);
    setLoadingMessage('Processing your choice...');

    try {
      const timelineContext = store.timeline
        .slice(-3)
        .map((e) => `${e.title}: ${e.description}`)
        .join(' ');

      const response = await fetch('/api/process-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choice: {
            id: choice.id,
            text: choice.text,
            description: choice.description,
            riskLevel: choice.riskLevel,
            category: choice.category,
          },
          currentAge: store.currentAge,
          stats: {
            money: store.stats.money,
            health: store.stats.health,
            career: store.stats.career,
            relationships: store.stats.relationships,
          },
          timelineContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to process choice');

      const data = await response.json();
      setCurrentOutcome(data.outcome);
      
      // Process the choice in store
      store.processChoice(choice, {
        title: data.outcome.title,
        description: data.outcome.description,
        statChanges: data.outcome.statChanges,
        impact: data.outcome.impact,
      });

      // Advance age
      store.advanceAge(data.outcome.yearsToAdvance);
      if (store.profile) {
        store.updateProfile({ age: store.currentAge + data.outcome.yearsToAdvance });
      }

      setPhase('outcome');
    } catch (error) {
      console.error('Error processing choice:', error);
      // Fallback outcome
      const fallbackOutcome = {
        title: 'Life Goes On',
        description: 'Your choice has been made. Time moves forward.',
        statChanges: [
          {
            stat: choice.category === 'life' ? 'relationships' : choice.category,
            change: choice.riskLevel === 'high' ? (Math.random() > 0.5 ? 10 : -10) : 5,
            reason: 'The result of your decision',
          },
        ],
        impact: 'neutral' as const,
        yearsToAdvance: 2,
      };
      setCurrentOutcome(fallbackOutcome);
      store.processChoice(choice, fallbackOutcome);
      store.advanceAge(2);
      setPhase('outcome');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleContinue = async () => {
    // Check if simulation should end
    if (store.currentAge >= store.targetAge) {
      await generateInsights();
      setPhase('results');
      store.completeSimulation();
      return;
    }

    setPhase('playing');
    await generateScenario();
  };

  const generateInsights = async () => {
    setIsLoading(true);
    setLoadingMessage('Analyzing your life journey...');

    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeline: store.timeline.map((e) => ({
            year: e.year,
            title: e.title,
            impact: e.impact,
          })),
          finalStats: {
            money: store.stats.money,
            health: store.stats.health,
            career: store.stats.career,
            relationships: store.stats.relationships,
          },
          choices: store.timeline
            .filter((e) => e.choiceMade)
            .map((e) => e.choiceMade!.text),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate insights');

      const data = await response.json();
      setInsights(data.insights);
      setLifeScore(data.lifeScore);
      setAchievements(
        data.achievements.map((a: any) => ({
          ...a,
          id: generateId(),
          icon: '🏆',
          unlockedAt: store.currentAge,
        }))
      );
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback insights
      setInsights([
        'Every choice shapes your destiny.',
        'Balance is key to a fulfilling life.',
        'The journey matters more than the destination.',
      ]);
      setLifeScore(Math.round(
        (store.stats.money + store.stats.health + store.stats.career + store.stats.relationships) / 4
      ));
      setAchievements([
        {
          id: generateId(),
          title: 'Life Explorer',
          description: 'Completed your life simulation',
          icon: '🏆',
          unlockedAt: store.currentAge,
          rarity: 'common',
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRestart = () => {
    store.resetSimulation();
    setPhase('setup');
    setCurrentOutcome(null);
    setInsights([]);
    setAchievements([]);
    setLifeScore(0);
    setName('');
  };

  // Loading overlay
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} submessage="This may take a moment..." />;
  }

  return (
    <Layout headerTitle="Simulation" showNav={phase !== 'outcome'}>
      <AnimatePresence mode="wait">
        {/* Setup Phase */}
        {phase === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Life
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Set up your simulation parameters
              </p>
            </div>

            <Card variant="default" padding="lg">
              <div className="space-y-5">
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                />

                <Select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />

                <Slider
                  label="Starting Age"
                  value={startAge}
                  onChange={setStartAge}
                  min={18}
                  max={40}
                />

                <Slider
                  label="Target Age"
                  value={targetAge}
                  onChange={setTargetAge}
                  min={50}
                  max={90}
                />

                <div className="pt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                    You will simulate {targetAge - startAge} years of life
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={handleStartSimulation}
                  >
                    Begin Simulation
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Playing Phase */}
        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Avatar and progress */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-4">
                <AvatarTransition
                  seed={store.profile?.avatarSeed || 'default'}
                  startAge={store.startAge}
                  endAge={store.targetAge}
                  currentAge={store.currentAge}
                  gender={store.profile?.gender}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {store.profile?.name || 'You'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Age {store.currentAge} • {store.targetAge - store.currentAge} years remaining
                  </p>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <StatsDisplay stats={store.stats} variant="compact" />

            {/* Meters */}
            <Card variant="default" padding="md">
              <DualMeter
                regretValue={store.regretMeter}
                rewardValue={store.rewardMeter}
              />
            </Card>

            {/* Timeline mini */}
            {store.timeline.length > 0 && (
              <TimelineMini
                events={store.timeline}
                startAge={store.startAge}
                targetAge={store.targetAge}
                currentAge={store.currentAge}
              />
            )}

            {/* Current scenario */}
            {store.currentScenario && (
              <ScenarioDisplay
                scenario={store.currentScenario}
                onChoiceSelect={handleChoiceSelect}
                isProcessing={isLoading}
              />
            )}
          </motion.div>
        )}

        {/* Outcome Phase */}
        {phase === 'outcome' && currentOutcome && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <OutcomeDisplay
              outcome={currentOutcome}
              onContinue={handleContinue}
            />
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              stats={store.stats}
              timeline={store.timeline}
              regretMeter={store.regretMeter}
              rewardMeter={store.rewardMeter}
              lifeScore={lifeScore}
              insights={insights}
              achievements={achievements}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
