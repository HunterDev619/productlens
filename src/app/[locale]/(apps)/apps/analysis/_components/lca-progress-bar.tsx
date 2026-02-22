'use client';

import {
  ChartBar,
  Flask,
  Globe,
  MagnifyingGlass,
  MapTrifold,
  Recycle,
  Sparkle,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

type LcaProgressBarProps = {
  isLoading: boolean;
  isComplete: boolean;
};

type AIStep = {
  id: number;
  label: string;
  icon: React.ElementType;
  duration: number; // seconds
};

const AI_STEPS: AIStep[] = [
  { id: 1, label: 'Analysing product specifications...', icon: MagnifyingGlass, duration: 10 },
  { id: 2, label: 'Processing material composition data...', icon: Flask, duration: 10 },
  { id: 3, label: 'Thinking...', icon: Sparkle, duration: 10 },
  { id: 4, label: 'Searching the database...', icon: Globe, duration: 50 },
  { id: 5, label: 'Summarising carbon footprint & life cycle analysis...', icon: Recycle, duration: 80 },
  { id: 6, label: 'Summarising IPCC climate-impact report...', icon: ChartBar, duration: 90 },
  { id: 7, label: 'Finalising LCA analysis & sustainability metrics...', icon: MapTrifold, duration: 60 },
];

export const LcaProgressBar = React.memo(({ isLoading, isComplete }: LcaProgressBarProps) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_DURATION = 300; // 5 minutes in seconds

  useEffect(() => {
    const resetProgress = () => {
      setProgressPercent(0);
      setCurrentStepIndex(0);
    };

    const completeProgress = () => {
      setProgressPercent(100);
      setCurrentStepIndex(AI_STEPS.length - 1);
    };

    if (isLoading && !isComplete) {
      // Reset về 0% và bắt đầu tăng dần
      resetProgress();

      let elapsedSeconds = 0;

      // Update progress every 500ms for smooth animation
      progressIntervalRef.current = setInterval(() => {
        elapsedSeconds += 0.5;

        // Update progress
        setProgressPercent((prev) => {
          if (prev >= 99) {
            return 99;
          }
          // Progress increases by (99 / 300) / 2 = 0.165% per 500ms to reach 99% in 5 minutes
          const increment = (99 / TOTAL_DURATION) / 2;
          return Math.min(prev + increment, 99);
        });

        // Update current step based on elapsed time
        let cumulativeDuration = 0;
        for (let i = 0; i < AI_STEPS.length; i++) {
          cumulativeDuration += AI_STEPS[i]?.duration ?? 0;
          if (elapsedSeconds < cumulativeDuration) {
            setCurrentStepIndex(i);
            break;
          }
        }
      }, 500);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    }

    if (isComplete) {
      // Khi có data, nhảy lên 100%
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      completeProgress();
    }

    return undefined;
  }, [isLoading, isComplete]);

  if (!isLoading) {
    return null;
  }

  const currentStep = AI_STEPS[currentStepIndex] ?? AI_STEPS[0] ?? AI_STEPS[0]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg sm:p-8 lg:p-10"
    >
      <div className="flex flex-col items-center gap-5 sm:gap-7">
        {/* Current Step Animation */}
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 sm:px-6 sm:py-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <currentStep.icon
                  size={28}
                  weight="duotone"
                  className="text-emerald-600 sm:h-8 sm:w-8"
                />
              </motion.div>
              <p className="text-sm font-medium text-gray-700 sm:text-base">
                {currentStep.label}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="w-full max-w-lg space-y-3">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner sm:h-4">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 shadow-lg"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>

          {/* Progress Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-emerald-600 sm:text-lg">
                {progressPercent.toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

LcaProgressBar.displayName = 'LcaProgressBar';
