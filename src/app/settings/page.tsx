'use client';

import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useSimulationStore } from '@/store';
import {
  Settings,
  Moon,
  Sun,
  Trash2,
  Info,
  Github,
  Heart,
  ExternalLink,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { resetSimulation, profile } = useSimulationStore();

  return (
    <Layout headerTitle="Settings">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Settings className="w-12 h-12 mx-auto text-primary-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Customize your experience
          </p>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Theme
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Light
                  </p>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-primary-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Dark
                  </p>
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your simulation data is stored locally on your device. Clearing
                  data will remove all your progress and history.
                </p>
              </div>
              <Button
                variant="danger"
                className="w-full"
                leftIcon={<Trash2 className="w-5 h-5" />}
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to clear all data? This cannot be undone.'
                    )
                  ) {
                    resetSimulation();
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Future You
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Version 1.0.0
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                An interactive life simulator powered by AI. Make choices and
                discover how different paths could shape your future.
              </p>

              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  Made with <Heart className="w-4 h-4 text-danger-500" /> using
                  Next.js & Gemini AI
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
