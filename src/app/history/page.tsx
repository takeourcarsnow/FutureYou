'use client';

import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Card, Button, Avatar } from '@/components/ui';
import { TimelineView } from '@/components/game';
import { useSimulationStore } from '@/store';
import Link from 'next/link';
import { Clock, PlayCircle, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const { profile, timeline, stats, currentAge, startAge, targetAge, resetSimulation, simulationComplete } = useSimulationStore();

  const hasHistory = timeline.length > 0;

  return (
    <Layout headerTitle="History">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Clock className="w-12 h-12 mx-auto text-primary-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Life Story
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View your simulation history
          </p>
        </motion.div>

        {hasHistory ? (
          <>
            {/* Profile summary */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-4">
                    <Avatar
                      seed={profile.avatarSeed}
                      age={currentAge}
                      gender={profile.gender}
                      size="lg"
                      showAge
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {profile.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Started at age {startAge} • {simulationComplete ? 'Completed' : 'In Progress'}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {timeline.length}
                          </p>
                          <p className="text-xs text-gray-500">Events</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-success-600 dark:text-success-400">
                            {timeline.filter((e) => e.impact === 'positive').length}
                          </p>
                          <p className="text-xs text-gray-500">Positive</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-danger-600 dark:text-danger-400">
                            {timeline.filter((e) => e.impact === 'negative').length}
                          </p>
                          <p className="text-xs text-gray-500">Negative</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Timeline
                </h3>
                <TimelineView
                  events={timeline}
                  currentAge={simulationComplete ? undefined : currentAge}
                />
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {!simulationComplete && (
                <Link href="/simulate">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<PlayCircle className="w-5 h-5" />}
                  >
                    Continue Simulation
                  </Button>
                </Link>
              )}
              <Button
                variant="danger"
                size="lg"
                className="w-full"
                leftIcon={<Trash2 className="w-5 h-5" />}
                onClick={() => {
                  if (confirm('Are you sure you want to clear your history? This cannot be undone.')) {
                    resetSimulation();
                  }
                }}
              >
                Clear History
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No History Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start a simulation to see your life story unfold
            </p>
            <Link href="/simulate">
              <Button
                variant="primary"
                leftIcon={<PlayCircle className="w-5 h-5" />}
              >
                Start Simulation
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
