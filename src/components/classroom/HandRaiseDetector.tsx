'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Camera, AlertCircle, Play, Square, Volume2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RaisedHand {
  id: number;
  studentName: string;
  studentId: string;
  timestamp: Date;
  confidence: number;
  position: { x: number; y: number };
}

interface HandRaiseDetectorProps {
  isActive: boolean;
  onHandRaised: (hands: RaisedHand[]) => void;
  onSelectStudent: (studentId: string, studentName: string) => void;
}

export function HandRaiseDetector({ isActive, onHandRaised, onSelectStudent }: HandRaiseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const handCountRef = useRef(0);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // student roster for matching hand positions to students
  const studentRoster = [
    { id: 'S001', name: 'Aman Singh', avatar: '👨‍🎓' },
    { id: 'S002', name: 'Priya Sharma', avatar: '👩‍🎓' },
    { id: 'S003', name: 'Raj Kumar', avatar: '👨‍🎓' },
    { id: 'S004', name: 'Neha Patel', avatar: '👩‍🎓' },
    { id: 'S005', name: 'Vikram Singh', avatar: '👨‍🎓' },
  ];

  // Start camera and hand detection
  const startDetection = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setIsDetecting(true);

        // Simulate hand detection with mock pose estimation
        detectionIntervalRef.current = setInterval(() => {
          simulateHandDetection();
        }, 1500);
      }
    } catch (err) {
      setError('Camera access denied. Using simulated hand detection.');
      setIsDetecting(true);

      // Still run mock detection without camera
      detectionIntervalRef.current = setInterval(() => {
        simulateHandDetection();
      }, 1500);
    }
  };

  // Mock hand detection using pose estimation simulation
  const simulateHandDetection = () => {
    if (!isDetecting) return;

    // Randomly detect hands from students
    if (Math.random() > 0.65 && raisedHands.length < 4) {
      const randomStudent = studentRoster[Math.floor(Math.random() * studentRoster.length)];

      // Check if student already has raised hand
      if (!raisedHands.some((h) => h.studentId === randomStudent.id)) {
        const newHand: RaisedHand = {
          id: handCountRef.current++,
          studentName: randomStudent.name,
          studentId: randomStudent.id,
          timestamp: new Date(),
          confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
          position: {
            x: Math.random() * 100,
            y: Math.random() * 100,
          },
        };

        setRaisedHands((prev) => {
          const updated = [...prev, newHand];
          onHandRaised(updated);
          return updated;
        });
      }
    }
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsDetecting(false);
    setCameraActive(false);
    setRaisedHands([]);
  };

  const selectStudent = (hand: RaisedHand) => {
    // Play notification sound
    console.log(`Selected ${hand.studentName} for interaction`);

    // Notify the AI avatar
    onSelectStudent(hand.studentId, hand.studentName);

    // Remove from raised hands list
    setRaisedHands((prev) => prev.filter((h) => h.id !== hand.id));
  };

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-gradient-to-br from-background to-secondary/10 rounded-lg border border-border/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-3">
          <motion.div
            animate={{ scale: isDetecting ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1.5, repeat: isDetecting ? Infinity : 0 }}
          >
            <Hand className="w-6 h-6 text-accent" />
          </motion.div>
          Hand Raise Detection System
          {isDetecting && (
            <motion.span
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-2 rounded-full bg-success ml-2"
            />
          )}
        </h3>

        {isDetecting ? (
          <Button variant="destructive" size="sm" onClick={stopDetection} className="gap-2">
            <Square className="w-4 h-4" />
            Stop Detection
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={startDetection} className="gap-2">
            <Play className="w-4 h-4" />
            Start Camera
          </Button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/30 flex gap-2 text-sm text-warning"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Feed & Detection Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <div className="relative w-full rounded-lg overflow-hidden bg-black border-2 border-border h-64">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />

            {/* Simulated Detection Overlay */}
            {isDetecting && !cameraActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-accent/30 border-2 border-accent mx-auto mb-3"
                  />
                  <p className="text-muted-foreground text-sm">
                    Scanning for raised hands...
                  </p>
                </div>
              </div>
            )}

            {!isDetecting && !cameraActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">Click "Start Camera" to begin</p>
                </div>
              </div>
            )}

            {/* Detected Hands Overlay */}
            <canvas ref={canvasRef} className="absolute inset-0" style={{ display: 'none' }} />
          </div>
        </div>

        {/* Detection Stats */}
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Detection Status</p>
            <p className="text-2xl font-bold text-accent">{isDetecting ? '🟢 Active' : '⭕ Inactive'}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {isDetecting ? 'Scanning for raised hands...' : 'Ready to start'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Hands Detected</p>
            <p className="text-2xl font-bold text-primary">{raisedHands.length}</p>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/30">
            <p className="text-xs text-muted-foreground mb-1">Confidence Avg</p>
            <p className="text-2xl font-bold text-success">
              {raisedHands.length > 0
                ? `${Math.round((raisedHands.reduce((acc, h) => acc + h.confidence, 0) / raisedHands.length) * 100)}%`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Raised Hands Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground">
            Raised Hands Queue ({raisedHands.length})
          </p>
          {raisedHands.length > 0 && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Zap className="w-4 h-4 text-accent" />
            </motion.span>
          )}
        </div>

        <AnimatePresence>
          {raisedHands.length > 0 ? (
            <div className="space-y-2">
              {raisedHands.map((hand, index) => (
                <motion.div
                  key={hand.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border-2 border-accent/50 group hover:border-accent transition cursor-pointer hover:shadow-lg"
                  onClick={() => selectStudent(hand)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="text-2xl"
                    >
                      ✋
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{hand.studentName}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>ID: {hand.studentId}</span>
                        <span>
                          <Volume2 className="w-3 h-3 inline mr-1" />
                          {Math.round(hand.confidence * 100)}%
                        </span>
                        <span>{hand.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90 opacity-100 group-hover:scale-105 transition"
                    onClick={() => selectStudent(hand)}
                  >
                    Select
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/20 text-center border border-border/50"
            >
              {isDetecting ? 'Waiting for students to raise hands...' : 'Start detection to monitor raised hands'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

