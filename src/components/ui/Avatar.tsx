'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarProps {
  seed: string;
  age: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAge?: boolean;
  className?: string;
  gender?: 'male' | 'female' | 'other';
}

export function Avatar({
  seed,
  age,
  size = 'md',
  showAge = false,
  className,
  gender = 'other',
}: AvatarProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const ageBadgeSizes = {
    sm: 'text-[10px] -bottom-1 -right-1 w-5 h-5',
    md: 'text-xs -bottom-1 -right-1 w-6 h-6',
    lg: 'text-sm -bottom-2 -right-2 w-8 h-8',
    xl: 'text-base -bottom-2 -right-2 w-10 h-10',
  };

  // Generate consistent avatar appearance based on seed
  const avatarStyle = useMemo(() => {
    const hash = seed.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 30);
    const lightness = 50 + (Math.abs(hash) % 20);

    return {
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      backgroundGradient: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 10}%))`,
    };
  }, [seed]);

  // Emoji based on age progression
  const getAgeEmoji = () => {
    if (age < 25) return '👶';
    if (age < 35) return gender === 'male' ? '👨' : gender === 'female' ? '👩' : '🧑';
    if (age < 50) return gender === 'male' ? '👨‍💼' : gender === 'female' ? '👩‍💼' : '🧑‍💼';
    if (age < 65) return gender === 'male' ? '👨‍🦳' : gender === 'female' ? '👩‍🦳' : '🧑‍🦳';
    return gender === 'male' ? '👴' : gender === 'female' ? '👵' : '🧓';
  };

  // Visual aging effects
  const getAgingEffects = () => {
    const baseOpacity = Math.min(0.3, (age - 40) / 100);
    return {
      wrinkles: age > 40 ? baseOpacity : 0,
      graying: age > 50 ? Math.min(0.5, (age - 50) / 50) : 0,
    };
  };

  const aging = getAgingEffects();

  return (
    <motion.div
      className={cn('relative inline-block', className)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden',
          'shadow-lg ring-4 ring-white dark:ring-gray-800',
          sizes[size]
        )}
        style={{ background: avatarStyle.backgroundGradient }}
      >
        {/* Base emoji */}
        <span className={cn('select-none', textSizes[size])}>
          {getAgeEmoji()}
        </span>

        {/* Aging overlay */}
        {aging.wrinkles > 0 && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, transparent 40%, rgba(128, 128, 128, ${aging.wrinkles}) 100%)`,
            }}
          />
        )}

        {/* Gray hair effect */}
        {aging.graying > 0 && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay"
            style={{
              background: `linear-gradient(180deg, rgba(200, 200, 200, ${aging.graying}) 0%, transparent 50%)`,
            }}
          />
        )}
      </div>

      {/* Age badge */}
      {showAge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute bg-primary-500 text-white rounded-full',
            'flex items-center justify-center font-bold',
            'shadow-md border-2 border-white dark:border-gray-800',
            ageBadgeSizes[size]
          )}
        >
          {age}
        </motion.div>
      )}
    </motion.div>
  );
}

interface AvatarTransitionProps {
  seed: string;
  startAge: number;
  endAge: number;
  currentAge: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gender?: 'male' | 'female' | 'other';
  className?: string;
}

export function AvatarTransition({
  seed,
  startAge,
  endAge,
  currentAge,
  size = 'lg',
  gender = 'other',
  className,
}: AvatarTransitionProps) {
  const progress = ((currentAge - startAge) / (endAge - startAge)) * 100;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <Avatar seed={seed} age={currentAge} size={size} showAge gender={gender} />
      
      {/* Age timeline */}
      <div className="w-full max-w-[200px]">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{startAge}</span>
          <span>{endAge}</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
