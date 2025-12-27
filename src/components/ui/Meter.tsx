'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MeterProps {
  value: number;
  maxValue?: number;
  label: string;
  icon?: React.ReactNode;
  type: 'regret' | 'reward';
  showGlow?: boolean;
  className?: string;
}

export function Meter({
  value,
  maxValue = 100,
  label,
  icon,
  type,
  showGlow = true,
  className,
}: MeterProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const colors = {
    regret: {
      bg: 'bg-danger-100 dark:bg-danger-900/30',
      fill: 'from-danger-400 via-danger-500 to-danger-600',
      glow: 'shadow-danger-500/50',
      text: 'text-danger-600 dark:text-danger-400',
      icon: 'bg-danger-500',
    },
    reward: {
      bg: 'bg-success-100 dark:bg-success-900/30',
      fill: 'from-success-400 via-success-500 to-success-600',
      glow: 'shadow-success-500/50',
      text: 'text-success-600 dark:text-success-400',
      icon: 'bg-success-500',
    },
  };

  const color = colors[type];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs',
                color.icon
              )}
            >
              {icon}
            </div>
          )}
          <span className={cn('text-sm font-semibold', color.text)}>{label}</span>
        </div>
        <span className={cn('text-sm font-bold', color.text)}>
          {Math.round(value)}%
        </span>
      </div>

      <div
        className={cn(
          'relative h-4 rounded-full overflow-hidden',
          color.bg
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-current"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        {/* Fill bar */}
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r',
            color.fill,
            showGlow && percentage > 50 && `shadow-lg ${color.glow}`
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Notches */}
        <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
          {[25, 50, 75].map((notch) => (
            <div
              key={notch}
              className={cn(
                'w-0.5 h-2 rounded-full transition-colors duration-300',
                percentage >= notch
                  ? 'bg-white/60'
                  : 'bg-gray-400/40 dark:bg-gray-500/40'
              )}
              style={{ marginLeft: `${notch - 12.5}%` }}
            />
          ))}
        </div>
      </div>

      {/* Warning thresholds */}
      {percentage >= 75 && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('text-xs mt-1.5', color.text)}
        >
          {type === 'regret' ? '⚠️ High regret level!' : '🎉 Great progress!'}
        </motion.p>
      )}
    </div>
  );
}

interface DualMeterProps {
  regretValue: number;
  rewardValue: number;
  className?: string;
}

export function DualMeter({ regretValue, rewardValue, className }: DualMeterProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Meter
        value={rewardValue}
        label="Rewards"
        icon="🏆"
        type="reward"
      />
      <Meter
        value={regretValue}
        label="Regrets"
        icon="😔"
        type="regret"
      />
    </div>
  );
}
