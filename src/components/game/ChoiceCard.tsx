'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, Button } from '@/components/ui';
import { Choice, LifeScenario } from '@/types';
import { cn, getRiskColor, getCategoryIcon } from '@/lib/utils';
import { AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';

interface ChoiceCardProps {
  choice: Choice;
  index: number;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  className?: string;
}

export function ChoiceCard({
  choice,
  index,
  onSelect,
  disabled = false,
  className,
}: ChoiceCardProps) {
  const riskColors = {
    low: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-700 dark:text-success-400',
      badge: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400',
    },
    medium: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-700 dark:text-warning-400',
      badge: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-400',
    },
    high: {
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-200 dark:border-danger-800',
      text: 'text-danger-700 dark:text-danger-400',
      badge: 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400',
    },
  };

  const colors = riskColors[choice.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <button
        onClick={() => !disabled && onSelect(choice)}
        disabled={disabled}
        className={cn(
          'w-full text-left rounded-2xl border-2 p-4 transition-all duration-300',
          'bg-white dark:bg-gray-900',
          'hover:shadow-ios dark:hover:shadow-ios-dark',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          colors.border,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(choice.category)}</span>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {choice.text}
            </h4>
          </div>
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full', colors.badge)}>
            {choice.riskLevel.charAt(0).toUpperCase() + choice.riskLevel.slice(1)} Risk
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {choice.description}
        </p>

        {/* Potential outcomes */}
        <div className={cn('rounded-lg p-3 mb-3', colors.bg)}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Potential Outcomes:
          </p>
          <ul className="space-y-1">
            {choice.potentialOutcomes.slice(0, 2).map((outcome, i) => (
              <li
                key={i}
                className={cn('text-xs flex items-start gap-1.5', colors.text)}
              >
                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        {/* Select button */}
        <div className="flex items-center justify-end text-primary-600 dark:text-primary-400">
          <span className="text-sm font-medium">Choose this path</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </button>
    </motion.div>
  );
}

interface ScenarioDisplayProps {
  scenario: LifeScenario;
  onChoiceSelect: (choice: Choice) => void;
  isProcessing?: boolean;
  className?: string;
}

export function ScenarioDisplay({
  scenario,
  onChoiceSelect,
  isProcessing = false,
  className,
}: ScenarioDisplayProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Scenario header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-3">
          <span>Age {scenario.currentAge}</span>
          <span>•</span>
          <span>Life Decision</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {scenario.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          {scenario.description}
        </p>
        {scenario.context && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">
            {scenario.context}
          </p>
        )}
      </motion.div>

      {/* Choices */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
          Choose your path wisely...
        </p>
        {scenario.choices.map((choice, index) => (
          <ChoiceCard
            key={choice.id || index}
            choice={choice}
            index={index}
            onSelect={onChoiceSelect}
            disabled={isProcessing}
          />
        ))}
      </div>
    </div>
  );
}
