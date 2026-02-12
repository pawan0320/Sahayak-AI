'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, MicOff } from 'lucide-react';

interface AIAvatarProps {
  isSpoken: boolean;
  isSpeaking: boolean;
  message: string;
  isListening: boolean;
}

export function AIAvatar({ isSpoken, isSpeaking, message, isListening }: AIAvatarProps) {
  const [blinkState, setBlinkState] = useState(false);

  useEffect(() => {
    if (!isSpeaking && !isListening) return;

    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Avatar Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-48 h-64 mb-8"
      >
        {/* Head */}
        <motion.div
          animate={{
            y: isSpeaking ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: isSpeaking ? Infinity : 0,
          }}
          className="relative w-full h-full"
        >
          {/* Background glow */}
          <motion.div
            animate={{
              opacity: isSpeaking ? [0.5, 0.8, 0.5] : 0.3,
              scale: isSpeaking ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isSpeaking ? Infinity : 0,
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl"
          />

          {/* Avatar head */}
          <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl border-2 border-primary/50 overflow-hidden flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-8 mb-6">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: blinkState ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                  className="w-6 h-8 bg-gradient-to-b from-primary to-accent rounded-full shadow-lg"
                >
                  {/* Pupil */}
                  <motion.div
                    animate={{
                      y: isSpeaking ? [0, 2, 0] : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: isSpeaking ? Infinity : 0,
                    }}
                    className="w-3 h-3 bg-foreground rounded-full mx-auto mt-1"
                  />
                </motion.div>
              ))}
            </div>

            {/* Mouth - Speaking animation */}
            <motion.div
              animate={{
                scaleY: isSpeaking ? [1, 1.5, 1.2, 1.5, 1] : 1,
              }}
              transition={{
                duration: 0.4,
                repeat: isSpeaking ? Infinity : 0,
              }}
              className="w-8 h-3 bg-gradient-to-r from-accent to-primary rounded-full"
            />
          </div>
        </motion.div>

        {/* Microphone indicator - when listening */}
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-4 -right-4 bg-success p-3 rounded-full border-2 border-background"
          >
            <Mic className="w-5 h-5 text-foreground" />
          </motion.div>
        )}

        {/* Speaker indicator - when speaking */}
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 bg-primary p-3 rounded-full border-2 border-background"
          >
            <Volume2 className="w-5 h-5 text-foreground" />
          </motion.div>
        )}
      </motion.div>

      {/* Message/Subtitle */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <p className="text-sm text-muted-foreground mb-1">
            {isListening ? '🎤 Listening...' : isSpeaking ? '🗣️ Speaking...' : 'Ready'}
          </p>
          <p className="text-base font-medium text-foreground line-clamp-3">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
