'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CircularProgress } from '@/components/ui';
import { LifeStats } from '@/types';
import { cn, getCategoryIcon } from '@/lib/utils';
import {
  DollarSign,
  Heart,
  Briefcase,
  Users,
  Smile,
} from 'lucide-react';

interface StatsDisplayProps {
  stats: LifeStats;
  showHappiness?: boolean;
  variant?: 'compact' | 'full' | 'cards';
  animated?: boolean;
  className?: string;
}

const statConfig = [
  { key: 'money', label: 'Money', icon: DollarSign, emoji: '💰', color: 'emerald' },
  { key: 'health', label: 'Health', icon: Heart, emoji: '❤️', color: 'rose' },
  { key: 'career', label: 'Career', icon: Briefcase, emoji: '💼', color: 'blue' },
  { key: 'relationships', label: 'Relations', icon: Users, emoji: '👥', color: 'purple' },
  { key: 'happiness', label: 'Happiness', icon: Smile, emoji: '😊', color: 'amber' },
] as const;

export function StatsDisplay({
  stats,
  showHappiness = true,
  variant = 'full',
  animated = true,
  className,
}: StatsDisplayProps) {
  const displayStats = showHappiness
    ? statConfig
    : statConfig.filter((s) => s.key !== 'happiness');

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 flex-wrap', className)}>
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <span className="text-sm">{stat.emoji}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stats[stat.key]}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3', className)}>
        {displayStats.slice(0, 4).map((stat, index) => {
          const StatIcon = stat.icon;
          const value = stats[stat.key];

          return (
            <motion.div
              key={stat.key}
              initial={animated ? { opacity: 0, y: 20 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" padding="md" className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`
                    )}
                  >
                    <StatIcon
                      className={cn(
                        'w-5 h-5',
                        `text-${stat.color}-600 dark:text-${stat.color}-400`
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Full variant with circular progress
  return (
    <div className={cn('flex flex-wrap justify-center gap-4', className)}>
      {displayStats.map((stat, index) => {
        const value = stats[stat.key];
        const colorClass =
          value >= 80
            ? 'success'
            : value >= 60
            ? 'primary'
            : value >= 40
            ? 'warning'
            : 'danger';

        return (
          <motion.div
            key={stat.key}
            initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-1"
          >
            <CircularProgress
              value={value}
              size={70}
              strokeWidth={6}
              color={colorClass}
              label={stat.emoji}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

interface StatChangeDisplayProps {
  changes: { stat: string; change: number; reason: string }[];
  className?: string;
}

export function StatChangeDisplay({ changes, className }: StatChangeDisplayProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {changes.map((change, index) => {
        const stat = statConfig.find((s) => s.key === change.stat);
        const isPositive = change.change > 0;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg',
              isPositive
                ? 'bg-success-50 dark:bg-success-900/20'
                : change.change < 0
                ? 'bg-danger-50 dark:bg-danger-900/20'
                : 'bg-gray-50 dark:bg-gray-800'
            )}
          >
            <span className="text-lg">{stat?.emoji || '📊'}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat?.label || change.stat}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {change.reason}
              </p>
            </div>
            <span
              className={cn(
                'text-sm font-bold',
                isPositive
                  ? 'text-success-600 dark:text-success-400'
                  : change.change < 0
                  ? 'text-danger-600 dark:text-danger-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {isPositive ? '+' : ''}{change.change}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
