'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface DigitalSealProps {
  progress: number; // 0-100
  stepsCompleted: number;
  totalSteps: number;
  showFinalStamp?: boolean;
  reduceMotion?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DigitalSeal({
  progress,
  stepsCompleted,
  totalSteps,
  showFinalStamp = false,
  reduceMotion = false,
  size = 'md',
}: DigitalSealProps) {
  // Size configurations
  const sizeConfig = {
    sm: { container: 120, radius: 50, stroke: 6, iconSize: 24, textSize: 'text-xs' },
    md: { container: 180, radius: 75, stroke: 8, iconSize: 36, textSize: 'text-sm' },
    lg: { container: 240, radius: 100, stroke: 10, iconSize: 48, textSize: 'text-base' },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Animation settings
  const animationDuration = reduceMotion ? 0 : 0.8;
  const springConfig = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 100, damping: 15 };

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center',
        'digital-seal-print'
      )}
      style={{ width: config.container, height: config.container }}
    >
      {/* SVG Progress Ring */}
      <svg
        className="absolute transform -rotate-90"
        width={config.container}
        height={config.container}
      >
        {/* Background circle */}
        <circle
          cx={config.container / 2}
          cy={config.container / 2}
          r={config.radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={config.stroke}
        />

        {/* Progress circle - Screen version (animated) */}
        <motion.circle
          className="screen-only-element"
          cx={config.container / 2}
          cy={config.container / 2}
          r={config.radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animationDuration, ease: 'easeOut' }}
        />

        {/* Progress circle - Print version (static, full) */}
        <circle
          className="print-only-element"
          cx={config.container / 2}
          cy={config.container / 2}
          r={config.radius}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={0}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Content - Screen Version */}
      <div className="screen-only-element absolute inset-0 flex items-center justify-center">
        {showFinalStamp ? (
          <motion.div
            className="seal-checkmark-bg flex flex-col items-center justify-center rounded-full"
            style={{
              width: config.radius * 1.4,
              height: config.radius * 1.4,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={springConfig}
          >
            <Check
              className="seal-check-icon text-white"
              size={config.iconSize}
              strokeWidth={3}
            />
            <span className={clsx('text-white font-semibold mt-1', config.textSize)}>
              SMA Committee
            </span>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <span className="text-3xl font-bold text-slate-800">
              {stepsCompleted}/{totalSteps}
            </span>
            <span className={clsx('text-slate-500', config.textSize)}>
              Steps Complete
            </span>
          </motion.div>
        )}
      </div>

      {/* Center Content - Print Version (always shows completed state) */}
      <div
        className="print-only-element absolute inset-0 flex items-center justify-center"
        style={{ display: 'none' }} // Hidden by default, shown by print CSS
      >
        <div
          className="seal-checkmark-bg flex flex-col items-center justify-center rounded-full"
          style={{
            width: config.radius * 1.4,
            height: config.radius * 1.4,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
          }}
        >
          <Check
            className="seal-check-icon text-white"
            size={config.iconSize}
            strokeWidth={3}
          />
          <span className={clsx('text-white font-semibold mt-1', config.textSize)}>
            SMA Committee
          </span>
        </div>
      </div>

      {/* Decorative Corner Brackets - Screen Version */}
      {showFinalStamp && (
        <>
          {/* Top-left bracket */}
          <motion.div
            className="screen-only-element absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-slate-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0 : 0.3 }}
          />
          {/* Top-right bracket */}
          <motion.div
            className="screen-only-element absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-slate-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0 : 0.3 }}
          />
          {/* Bottom-left bracket */}
          <motion.div
            className="screen-only-element absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-slate-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.5, duration: reduceMotion ? 0 : 0.3 }}
          />
          {/* Bottom-right bracket */}
          <motion.div
            className="screen-only-element absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-slate-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.6, duration: reduceMotion ? 0 : 0.3 }}
          />
        </>
      )}

      {/* Decorative Corner Brackets - Print Version */}
      <div
        className="print-only-element absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-slate-400"
        style={{ display: 'none' }}
      />
      <div
        className="print-only-element absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-slate-400"
        style={{ display: 'none' }}
      />
      <div
        className="print-only-element absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-slate-400"
        style={{ display: 'none' }}
      />
      <div
        className="print-only-element absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-slate-400"
        style={{ display: 'none' }}
      />
    </div>
  );
}
