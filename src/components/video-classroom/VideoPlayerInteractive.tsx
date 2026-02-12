'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Maximize,
  MessageCircle,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIAvatarVideo } from './AIAvatarVideo';

interface VideoSegment {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: 'introduction' | 'explanation' | 'example' | 'question' | 'summary';
  avatarExpression: 'neutral' | 'happy' | 'thinking' | 'excited' | 'concerned';
  gestures: string[];
}

interface VideoPlayerProps {
  segments: VideoSegment[];
  topic: string;
  onSegmentChange?: (segmentId: string) => void;
  onEngagementUpdate?: (level: number) => void;
}

export function VideoPlayerInteractive({
  segments,
  topic,
  onSegmentChange,
  onEngagementUpdate,
}: VideoPlayerProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [engagementLevel, setEngagementLevel] = useState(75);
  const [studentCount, setStudentCount] = useState(4);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSegment = segments[currentSegmentIndex];

  // Calculate total duration
  useEffect(() => {
    const total = segments.reduce((sum, seg) => sum + seg.duration, 0);
    setTotalDuration(total);
  }, [segments]);

  // Video playback timer
  useEffect(() => {
    if (isPlaying && currentSegment) {
      progressIntervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          const segmentProgress = (newTime / currentSegment.duration) * 100;
          setProgress(segmentProgress);

          // Move to next segment when current finished
          if (newTime >= currentSegment.duration) {
            if (currentSegmentIndex < segments.length - 1) {
              setCurrentSegmentIndex((prev) => prev + 1);
              setElapsedTime(0);
              setProgress(0);
              onSegmentChange?.(segments[currentSegmentIndex + 1].id);
            } else {
              setIsPlaying(false); // End of video
            }
            return 0;
          }
          return newTime;
        });

        // Simulate engagement fluctuation
        setEngagementLevel((prev) => {
          const change = (Math.random() - 0.5) * 5;
          const newLevel = Math.max(20, Math.min(100, prev + change));
          onEngagementUpdate?.(Math.round(newLevel));
          return newLevel;
        });
      }, 1000);

      return () => {
        if (progressIntervalRef.current !== null) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isPlaying, currentSegment, currentSegmentIndex, segments, onSegmentChange, onEngagementUpdate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSegmentSkip = (direction: 'forward' | 'backward') => {
    if (direction === 'forward' && currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex((prev) => prev + 1);
      setElapsedTime(0);
      setProgress(0);
    } else if (direction === 'backward' && currentSegmentIndex > 0) {
      setCurrentSegmentIndex((prev) => prev - 1);
      setElapsedTime(0);
      setProgress(0);
    }
  };

  const handleFullScreen = () => {
    if (!playerRef.current) return;

    if (!isFullScreen) {
      playerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullScreen(!isFullScreen);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={playerRef}
      className={`relative w-full bg-gradient-to-b from-background via-secondary/20 to-background rounded-xl border border-border/50 overflow-hidden shadow-2xl transition-all ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Video Area */}
      <div className={`relative ${isFullScreen ? 'w-screen h-screen' : 'w-full h-96'} bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center overflow-hidden`}>
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-primary/20" />
            ))}
          </div>
        </div>

        {/* Avatar */}
        <motion.div className="relative z-10 w-full h-full">
          <AIAvatarVideo
            message={currentSegment?.content || ''}
            state={{
              expression: (currentSegment?.avatarExpression as any) || 'neutral',
              isSpeaking: isPlaying,
              isListening: currentSegment?.type === 'question',
              gesture: currentSegment?.gestures[0] || 'neutral',
              engagementLevel,
            }}
            isMuted={isMuted}
          />
        </motion.div>

        {/* Loading Indicator */}
        {isPlaying && (
          <motion.div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
            <motion.div
              className="w-2 h-2 rounded-full bg-success"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-success">Live</span>
          </motion.div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="relative z-20 bg-background/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 space-y-3">
        {/* Progress Bar */}
        <motion.div className="space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-full h-1 bg-secondary/40 rounded-full overflow-hidden cursor-pointer group">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Hover indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 -ml-1.5"
              style={{ left: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>{formatTime(elapsedTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </motion.div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSegmentSkip('backward')}
              disabled={currentSegmentIndex === 0}
              className="hover:bg-primary/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-10 w-10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSegmentSkip('forward')}
              disabled={currentSegmentIndex === segments.length - 1}
              className="hover:bg-primary/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-2 px-2 py-1 rounded-lg bg-secondary/20 border border-border/50 group hover:border-primary/50 transition">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-6 w-6"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-secondary rounded-full appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${isMuted ? 0 : volume}%, rgb(82,82,82) ${isMuted ? 0 : volume}%, rgb(82,82,82) 100%)`,
                }}
              />
              <span className="text-xs text-muted-foreground w-6 text-right">{isMuted ? 0 : volume}%</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Segment Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/20 border border-border/50">
              <span className="text-xs font-medium">
                Segment {currentSegmentIndex + 1}/{segments.length}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-primary/20"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullScreen}
              className="hover:bg-primary/20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Segment Info */}
        <motion.div
          layout
          className="flex items-center justify-between px-2 py-1 bg-secondary/10 rounded-lg border border-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <p className="text-xs font-semibold text-primary">{currentSegment?.title}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentSegment?.type}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">{Math.round(engagementLevel)}%</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
              <Users className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium">{studentCount}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute bottom-full left-0 right-0 bg-background border-t border-border/50 p-4 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div>
              <label className="text-sm font-medium mb-2 block">Playback Speed</label>
              <div className="flex gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                  <Button key={speed} variant="outline" size="sm" className="text-xs">
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subtitles</label>
              <Button variant="outline" size="sm" className="text-xs">
                ON
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
