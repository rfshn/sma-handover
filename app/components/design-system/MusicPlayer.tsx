'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

interface MusicPlayerProps {
  reduceMotion?: boolean;
}

export function MusicPlayer({ reduceMotion = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    // Using a placeholder - in production, use actual ceremonial music URL
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Note: In a real app, you'd set audioRef.current.src to actual music
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Audio playback requires user interaction');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div
      className={clsx(
        'music-player fixed bottom-4 right-4 flex items-center gap-2 p-3 rounded-full',
        'bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200',
        'transition-all duration-200 hover:shadow-xl',
        'print:hidden'
      )}
      data-print-hidden="true"
    >
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="h-8 w-8 rounded-full"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause size={16} className="text-slate-700" />
        ) : (
          <Play size={16} className="text-slate-700 ml-0.5" />
        )}
      </Button>

      {/* Volume Slider */}
      <div className="hidden sm:flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          aria-label="Volume"
        />
      </div>

      {/* Mute Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="h-8 w-8 rounded-full"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={16} className="text-slate-500" />
        ) : (
          <Volume2 size={16} className="text-slate-700" />
        )}
      </Button>
    </div>
  );
}
