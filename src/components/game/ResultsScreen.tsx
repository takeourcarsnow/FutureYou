'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, CircularProgress } from '@/components/ui';
import { SimulationResult, Achievement, LifeStats } from '@/types';
import { StatsDisplay, StatChangeDisplay } from './StatsDisplay';
import { TimelineView } from './TimelineView';
import { cn } from '@/lib/utils';
import {
  Trophy,
  RefreshCw,
  Share2,
  Download,
  Sparkles,
  Star,
  Award,
  Lightbulb,
} from 'lucide-react';
import { useState } from 'react';

interface ResultsScreenProps {
  stats: LifeStats;
  timeline: { year: number; age: number; title: string; description: string; impact: string; statChanges: any[]; category: string }[];
  regretMeter: number;
  rewardMeter: number;
  lifeScore: number;
  insights: string[];
  achievements: Achievement[];
  onRestart: () => void;
  className?: string;
}

export function ResultsScreen({
  stats,
  timeline,
  regretMeter,
  rewardMeter,
  lifeScore,
  insights,
  achievements,
  onRestart,
  className,
}: ResultsScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'insights'>('overview');

  const getScoreGrade = () => {
    if (lifeScore >= 90) return { grade: 'S', color: 'text-amber-500', label: 'Legendary Life!' };
    if (lifeScore >= 80) return { grade: 'A', color: 'text-success-500', label: 'Amazing Journey!' };
    if (lifeScore >= 70) return { grade: 'B', color: 'text-primary-500', label: 'Great Life!' };
    if (lifeScore >= 60) return { grade: 'C', color: 'text-warning-500', label: 'Good Experience' };
    if (lifeScore >= 50) return { grade: 'D', color: 'text-orange-500', label: 'Life Lessons' };
    return { grade: 'F', color: 'text-danger-500', label: 'Hard Times' };
  };

  const scoreInfo = getScoreGrade();

  const rarityColors = {
    common: 'bg-gray-100 dark:bg-gray-800 border-gray-300',
    rare: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300',
    epic: 'bg-purple-50 dark:bg-purple-900/30 border-purple-300',
    legendary: 'bg-amber-50 dark:bg-amber-900/30 border-amber-300',
  };

  const rarityIcons = {
    common: '⭐',
    rare: '💎',
    epic: '🔮',
    legendary: '👑',
  };

  return (
    <div className={cn('space-y-6 pb-24', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-block mb-4"
        >
          <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Simulation Complete!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your life story has been written
        </p>
      </motion.div>

      {/* Life Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="elevated" className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <CircularProgress
                value={lifeScore}
                size={140}
                strokeWidth={10}
                showValue={false}
                color="primary"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-5xl font-bold', scoreInfo.color)}>
                  {scoreInfo.grade}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {lifeScore}/100
                </span>
              </div>
            </div>
            <div>
              <h2 className={cn('text-xl font-bold', scoreInfo.color)}>
                {scoreInfo.label}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {timeline.length} life events experienced
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Star },
          { id: 'timeline', label: 'Timeline', icon: Sparkles },
          { id: 'insights', label: 'Insights', icon: Lightbulb },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === id
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Final stats */}
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Final Stats
              </h3>
              <StatsDisplay stats={stats} variant="full" />
            </Card>

            {/* Meters */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="default" className="p-4 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {rewardMeter}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rewards</p>
              </Card>
              <Card variant="default" className="p-4 text-center">
                <div className="text-3xl mb-2">😔</div>
                <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                  {regretMeter}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Regrets</p>
              </Card>
            </div>

            {/* Achievements */}
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Achievements Unlocked
                </h3>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border',
                      rarityColors[achievement.rarity as keyof typeof rarityColors]
                    )}
                  >
                    <span className="text-2xl">
                      {rarityIcons[achievement.rarity as keyof typeof rarityIcons]}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      {achievement.rarity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Life Story
              </h3>
              <TimelineView events={timeline as any} />
            </Card>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Life Lessons
                </h3>
              </div>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20"
                  >
                    <span className="text-amber-500 font-bold">{index + 1}.</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            leftIcon={<RefreshCw className="w-5 h-5" />}
            onClick={onRestart}
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Share2 className="w-5 h-5" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Future You Results',
                  text: `I scored ${lifeScore} in Future You Simulator! Grade: ${scoreInfo.grade}`,
                });
              }
            }}
          >
            Share
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
