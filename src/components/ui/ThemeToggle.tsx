'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        'relative w-14 h-7 rounded-full p-0.5 transition-colors duration-300',
        'bg-gray-200 dark:bg-gray-700',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun className="w-4 h-4 text-amber-500 opacity-50 dark:opacity-100" />
        <Moon className="w-4 h-4 text-primary-400 opacity-100 dark:opacity-50" />
      </div>

      {/* Toggle knob */}
      <motion.div
        className={cn(
          'relative w-6 h-6 rounded-full shadow-md',
          'bg-white dark:bg-gray-900',
          'flex items-center justify-center'
        )}
        initial={false}
        animate={{
          x: theme === 'dark' ? 26 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-primary-400" />
        )}
      </motion.div>
    </motion.button>
  );
}
