'use client';

import { motion } from 'framer-motion';
import { TimelineEvent } from '@/types';
import { cn, getCategoryIcon, getCategoryColor, getImpactColor } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface TimelineViewProps {
  events: TimelineEvent[];
  currentAge?: number;
  className?: string;
}

export function TimelineView({ events, currentAge, className }: TimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-gray-500 dark:text-gray-400">
          Your life story hasn&apos;t started yet...
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Events */}
      <div className="space-y-4">
        {events.map((event, index) => {
          const isExpanded = expandedId === event.id;
          const isLatest = index === events.length - 1;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-4 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-md',
                  isLatest ? 'ring-4 ring-primary-200 dark:ring-primary-900' : '',
                  getCategoryColor(event.category)
                )}
              />

              {/* Event card */}
              <motion.div
                className={cn(
                  'rounded-xl overflow-hidden transition-all duration-300',
                  'bg-white dark:bg-gray-900',
                  'border border-gray-100 dark:border-gray-800',
                  'shadow-sm hover:shadow-ios dark:hover:shadow-ios-dark'
                )}
                layout
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getCategoryIcon(event.category)}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Age {event.age} • {event.year}
                        </span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            getImpactColor(event.impact)
                          )}
                        >
                          {event.impact}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {event.description}
                    </p>

                    {/* Choice made */}
                    {event.choiceMade && (
                      <div className="mb-3 p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          Choice made: {event.choiceMade.text}
                        </p>
                      </div>
                    )}

                    {/* Stat changes */}
                    {event.statChanges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.statChanges.map((change, i) => (
                          <span
                            key={i}
                            className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              change.change > 0
                                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                                : change.change < 0
                                ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            )}
                          >
                            {getCategoryIcon(change.stat)} {change.change > 0 ? '+' : ''}
                            {change.change}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Current position indicator */}
        {currentAge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative pl-14"
          >
            <div className="absolute left-4 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-gray-900 shadow-md animate-pulse" />
            <div className="py-2 px-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
                Current Age: {currentAge} - Your story continues...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface TimelineMiniProps {
  events: TimelineEvent[];
  startAge: number;
  targetAge: number;
  currentAge: number;
  className?: string;
}

export function TimelineMini({
  events,
  startAge,
  targetAge,
  currentAge,
  className,
}: TimelineMiniProps) {
  const progress = ((currentAge - startAge) / (targetAge - startAge)) * 100;
  const eventPositions = events.map((e) =>
    ((e.age - startAge) / (targetAge - startAge)) * 100
  );

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Age {startAge}</span>
        <span>Age {targetAge}</span>
      </div>
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Event markers */}
        {eventPositions.map((pos, i) => (
          <div
            key={i}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white',
              events[i].impact === 'positive'
                ? 'bg-success-500'
                : events[i].impact === 'negative'
                ? 'bg-danger-500'
                : 'bg-gray-400'
            )}
            style={{ left: `calc(${pos}% - 4px)` }}
          />
        ))}

        {/* Current position */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 shadow-md"
          initial={{ left: 0 }}
          animate={{ left: `calc(${progress}% - 8px)` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {events.length} life events • Currently age {currentAge}
      </p>
    </div>
  );
}
