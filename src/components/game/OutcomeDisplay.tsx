'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { StatChangeDisplay } from './StatsDisplay';
import { cn, getImpactColor } from '@/lib/utils';
import { CheckCircle, XCircle, MinusCircle, Clock, Sparkles } from 'lucide-react';

interface OutcomeDisplayProps {
  outcome: {
    title: string;
    description: string;
    statChanges: { stat: string; change: number; reason: string }[];
    impact: 'positive' | 'negative' | 'neutral';
    yearsToAdvance: number;
  };
  onContinue: () => void;
  className?: string;
}

export function OutcomeDisplay({ outcome, onContinue, className }: OutcomeDisplayProps) {
  const impactConfig = {
    positive: {
      icon: CheckCircle,
      color: 'text-success-500',
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      label: 'Positive Outcome',
    },
    negative: {
      icon: XCircle,
      color: 'text-danger-500',
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-200 dark:border-danger-800',
      label: 'Challenging Outcome',
    },
    neutral: {
      icon: MinusCircle,
      color: 'text-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      label: 'Neutral Outcome',
    },
  };

  const config = impactConfig[outcome.impact];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn('space-y-4', className)}
      >
        {/* Result header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className={cn(
            'text-center p-6 rounded-2xl border-2',
            config.bg,
            config.border
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Icon className={cn('w-16 h-16 mx-auto mb-3', config.color)} />
          </motion.div>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-sm font-medium mb-2',
              config.bg,
              config.color
            )}
          >
            {config.label}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {outcome.title}
          </h2>
        </motion.div>

        {/* Description */}
        <Card variant="default" padding="lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {outcome.description}
            </p>
          </div>
        </Card>

        {/* Stat changes */}
        {outcome.statChanges.length > 0 && (
          <Card variant="default" padding="lg">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              Life Changes
            </h3>
            <StatChangeDisplay changes={outcome.statChanges} />
          </Card>
        )}

        {/* Time passage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-50 dark:bg-primary-900/20"
        >
          <Clock className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
            {outcome.yearsToAdvance} {outcome.yearsToAdvance === 1 ? 'year' : 'years'} have passed
          </span>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className={cn(
            'w-full py-4 rounded-xl font-semibold text-white',
            'bg-gradient-to-r from-primary-500 to-primary-600',
            'hover:from-primary-600 hover:to-primary-700',
            'shadow-lg hover:shadow-xl transition-all'
          )}
        >
          Continue Your Journey →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
