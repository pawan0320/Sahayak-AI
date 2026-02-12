'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageCircle,
  Zap,
  Eye,
  Heart,
  Lightbulb,
} from 'lucide-react';

interface AvatarState {
  expression: 'neutral' | 'happy' | 'thinking' | 'excited' | 'concerned';
  isSpeaking: boolean;
  isListening: boolean;
  gesture: string;
  engagementLevel: number; // 0-100
}

interface AIAvatarVideoProps {
  message: string;
  state: AvatarState;
  onInteraction?: (gesture: string) => void;
  isMuted?: boolean;
}

export function AIAvatarVideo({ message, state, onInteraction, isMuted = false }: AIAvatarVideoProps) {
  const [mouthFrame, setMouthFrame] = useState(0);
  const [blinkFrame, setBlinkFrame] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const blinkRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate speech animation - mouth movement
  useEffect(() => {
    if (state.isSpeaking && !isMuted) {
      animationRef.current = setInterval(() => {
        setMouthFrame((prev) => (prev + 1) % 4);
      }, 100);
      return () => {
        if (animationRef.current !== null) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [state.isSpeaking, isMuted]);

  // Eye blinking animation
  useEffect(() => {
    blinkRef.current = setInterval(() => {
      setBlinkFrame((prev) => {
        if (prev === 0) {
          setTimeout(() => setBlinkFrame(2), 100);
          return 1;
        }
        if (prev === 2) {
          return 0;
        }
        return prev;
      });
    }, 3000 + Math.random() * 2000);

    return () => {
      if (blinkRef.current !== null) {
        clearInterval(blinkRef.current);
      }
    };
  }, []);

  const getExpressionStyle = () => {
    const baseStyle = 'transition-all duration-300';

    switch (state.expression) {
      case 'happy':
        return `${baseStyle} scale-105 text-primary`;
      case 'excited':
        return `${baseStyle} scale-110 text-accent`;
      case 'thinking':
        return `${baseStyle} scale-100 text-primary/70`;
      case 'concerned':
        return `${baseStyle} scale-95 text-warning`;
      default:
        return `${baseStyle} scale-100`;
    }
  };

  const getMouthShape = () => {
    if (!state.isSpeaking) return 'O';
    const shapes = ['○', '◉', '◎', '●'];
    return shapes[mouthFrame];
  };

  const getEyeShape = () => {
    if (blinkFrame === 1) return '━';
    if (blinkFrame === 2) return '━';
    return '●';
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar Head */}
      <motion.div
        className={`relative w-48 h-64 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border-4 border-primary/50 shadow-2xl overflow-hidden ${getExpressionStyle()}`}
        animate={{
          y: state.isSpeaking ? [-5, 5, -5] : 0,
          scale: state.isListening ? 1.05 : 1,
        }}
        transition={{ duration: 0.3, repeat: state.isSpeaking ? Infinity : 0 }}
      >
        {/* Face Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/50 via-yellow-200/30 to-transparent" />

        {/* Eyes */}
        <div className="absolute top-16 left-16 flex gap-12">
          {/* Left Eye */}
          <motion.div
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            animate={{ scaleY: blinkFrame > 0 ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-4 h-4 bg-black rounded-full"
              animate={{
                x: state.isListening ? -2 : 0,
                y: state.isListening ? -2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-0" />
            </motion.div>
          </motion.div>

          {/* Right Eye */}
          <motion.div
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            animate={{ scaleY: blinkFrame > 0 ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-4 h-4 bg-black rounded-full"
              animate={{
                x: state.isListening ? 2 : 0,
                y: state.isListening ? -2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-0" />
            </motion.div>
          </motion.div>
        </div>

        {/* Nose */}
        <div className="absolute top-32 left-24 w-2 h-6 bg-yellow-400/60 rounded-full" />

        {/* Mouth */}
        <motion.div
          className="absolute top-40 left-20 w-12 h-8 flex items-center justify-center"
          animate={{
            scaleY: state.isSpeaking ? [1, 1.3, 1.1, 1.3, 1] : 1,
            scaleX: state.isSpeaking ? [1, 1.1, 0.9, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: state.isSpeaking ? Infinity : 0,
          }}
        >
          <div className="text-3xl font-bold text-red-400">{getMouthShape()}</div>
        </motion.div>

        {/* Eyebrows */}
        <div className="absolute top-12 left-16 flex gap-12">
          <motion.div
            className="w-6 h-1 bg-black rounded-full"
            animate={{
              rotate: state.expression === 'thinking' ? -15 : state.expression === 'concerned' ? 15 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="w-6 h-1 bg-black rounded-full"
            animate={{
              rotate: state.expression === 'thinking' ? 15 : state.expression === 'concerned' ? -15 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Blush */}
        {state.expression === 'happy' && (
          <motion.div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-32 left-4 w-8 h-4 bg-pink-300/50 rounded-full blur-xl" />
            <div className="absolute top-32 right-4 w-8 h-4 bg-pink-300/50 rounded-full blur-xl" />
          </motion.div>
        )}
      </motion.div>

      {/* Gesture Animation - Hand */}
      {(state.gesture === 'wave' || state.gesture === 'point' || state.gesture === 'expand_hands') && (
        <motion.div
          className="absolute bottom-20 right-16 text-5xl"
          initial={{ opacity: 0, rotate: -45 }}
          animate={{
            opacity: 1,
            rotate: state.gesture === 'wave' ? [0, 20, 0, 20, 0] : 0,
            x: state.gesture === 'point' ? [0, 10, 20] : 0,
            scale: state.gesture === 'expand_hands' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: state.gesture === 'wave' ? 1 : 0.6,
            repeat: state.isSpeaking ? Infinity : 0,
          }}
        >
          👋
        </motion.div>
      )}

      {/* Message Display */}
      <motion.div
        className="mt-8 max-w-md text-center p-4 rounded-lg bg-white/10 border border-primary/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">{message}</p>

        {/* Status Indicators */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {state.isSpeaking && (
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
              🎤
            </motion.span>
          )}
          {state.isListening && (
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
              👂
            </motion.span>
          )}
          {isMuted && <VolumeX className="w-3 h-3" />}
        </div>
      </motion.div>

      {/* Engagement Indicator */}
      <motion.div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs bg-secondary/40 px-3 py-2 rounded-full border border-border/50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart className="w-3 h-3 text-accent" />
        </motion.div>
        <span className="text-muted-foreground">
          {state.engagementLevel > 75
            ? 'Highly Engaged'
            : state.engagementLevel > 50
              ? 'Engaged'
              : 'Needs Attention'}
        </span>
      </motion.div>

      {/* Stats */}
      <motion.div className="absolute bottom-6 right-6 flex gap-3 text-xs text-muted-foreground">
        {state.isListening && (
          <motion.div
            className="flex items-center gap-1 bg-success/20 px-2 py-1 rounded-full border border-success/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <MessageCircle className="w-3 h-3 text-success" />
            Listening
          </motion.div>
        )}
        {state.isSpeaking && (
          <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full border border-primary/30">
            <Zap className="w-3 h-3 text-primary" />
            Speaking
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
