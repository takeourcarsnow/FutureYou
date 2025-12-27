'use client';

import { motion } from 'framer-motion';
import { cn, getStatGradient } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  gradient?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
}

export function ProgressBar({
  value,
  maxValue = 100,
  showLabel = false,
  label,
  size = 'md',
  animated = true,
  className,
  gradient = true,
  color = 'auto',
}: ProgressBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getColor = () => {
    if (color !== 'auto') {
      return {
        primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
        success: 'bg-gradient-to-r from-success-400 to-success-600',
        warning: 'bg-gradient-to-r from-warning-400 to-warning-600',
        danger: 'bg-gradient-to-r from-danger-400 to-danger-600',
      }[color];
    }
    return gradient
      ? `bg-gradient-to-r ${getStatGradient(value)}`
      : 'bg-primary-500';
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', getColor())}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
  className?: string;
}

export function CircularProgress({
  value,
  maxValue = 100,
  size = 80,
  strokeWidth = 8,
  showValue = true,
  label,
  color = 'auto',
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    const colorValue = color === 'auto' ? value : -1;
    if (color === 'primary' || colorValue === -1) return 'stroke-primary-500';
    if (colorValue >= 80 || color === 'success') return 'stroke-success-500';
    if (colorValue >= 60) return 'stroke-primary-500';
    if (colorValue >= 40 || color === 'warning') return 'stroke-warning-500';
    return 'stroke-danger-500';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={getStrokeColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.round(value)}
          </span>
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
