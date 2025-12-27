'use client';

import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Card, Button, Avatar } from '@/components/ui';
import { useSimulationStore } from '@/store';
import Link from 'next/link';
import {
  PlayCircle,
  Sparkles,
  TrendingUp,
  Heart,
  Briefcase,
  Users,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { profile, simulationComplete, timeline, stats } = useSimulationStore();

  const features = [
    {
      icon: TrendingUp,
      title: 'Money Decisions',
      description: 'Financial choices that shape your wealth',
      color: 'bg-emerald-500',
    },
    {
      icon: Heart,
      title: 'Health Choices',
      description: 'Lifestyle decisions affecting wellbeing',
      color: 'bg-rose-500',
    },
    {
      icon: Briefcase,
      title: 'Career Paths',
      description: 'Professional opportunities and risks',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Relationships',
      description: 'Connections that define your life',
      color: 'bg-purple-500',
    },
  ];

  return (
    <Layout headerTitle="Future You">
      <div className="space-y-8">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative inline-block mb-6"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg animate-pulse-glow">
              <span className="text-5xl">🔮</span>
            </div>
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-primary-300 dark:border-primary-700"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Discover Your{' '}
            <span className="text-gradient bg-gradient-to-r from-primary-500 to-purple-500">
              Future
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Make choices, see realistic outcomes, and explore the paths your life could take
          </p>
        </motion.div>

        {/* Continue simulation card */}
        {profile && !simulationComplete && timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated" className="p-4 border-l-4 border-primary-500">
              <div className="flex items-center gap-4">
                <Avatar seed={profile.avatarSeed} age={profile.age} size="md" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Continue as
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {timeline.length} events • Age {profile.age}
                  </p>
                </div>
                <Link href="/simulate">
                  <Button variant="primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Resume
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/simulate">
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4 text-lg"
              leftIcon={<PlayCircle className="w-6 h-6" />}
            >
              {profile && !simulationComplete ? 'Continue Simulation' : 'Start Your Journey'}
            </Button>
          </Link>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card variant="default" padding="md" className="h-full">
                  <div
                    className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What You&apos;ll Experience
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { icon: '🌳', text: 'Branching timelines based on your choices' },
                { icon: '👤', text: 'Visual aging as time progresses' },
                { icon: '📊', text: 'Track regrets and rewards' },
                { icon: '🤖', text: 'AI-powered realistic outcomes' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 py-4"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-500">
              <Clock className="w-4 h-4" />
              <span className="font-bold">40+</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Years to simulate</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">100+</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Unique scenarios</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-500">
              <Zap className="w-4 h-4" />
              <span className="font-bold">∞</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Possibilities</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
