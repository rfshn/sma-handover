'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface ConfettiProps {
  reduceMotion?: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
];

export function Confetti({ reduceMotion = false }: ConfettiProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Generate confetti pieces
  const pieces: ConfettiPiece[] = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 8,
    }));
  }, []);

  // Hide confetti after animation completes
  useEffect(() => {
    if (reduceMotion) {
      // For reduced motion, show static confetti briefly then hide
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [reduceMotion]);

  if (!isVisible) return null;

  // For reduced motion, show static confetti
  if (reduceMotion) {
    return (
      <div className="confetti-container fixed inset-0 pointer-events-none overflow-hidden z-50">
        {pieces.slice(0, 20).map((piece) => (
          <div
            key={piece.id}
            className="absolute rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: `${20 + Math.random() * 60}%`,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="confetti-container fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
          }}
          initial={{
            top: '-5%',
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            top: '105%',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
