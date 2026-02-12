'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hand, Plus, Minimize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface StudentCameraFeed {
  id: string;
  studentId: string;
  name: string;
  isHandRaised: boolean;
  confidence: number;
  position?: { x: number; y: number };
  isMuted?: boolean;
  isActive: boolean;
}

interface StudentCameraGridProps {
  students: StudentCameraFeed[];
  selectedStudentId?: string;
  onStudentSelect?: (studentId: string) => void;
  onHandRaiseDetected?: (studentId: string) => void;
  gridSize?: 'small' | 'medium' | 'large';
}

export function StudentCameraGrid({
  students,
  selectedStudentId,
  onStudentSelect,
  onHandRaiseDetected,
  gridSize = 'medium',
}: StudentCameraGridProps) {
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [pulsingHands, setPulsingHands] = useState<Set<string>>(new Set());

  // Track hand raise detections
  useEffect(() => {
    const raisedHands = new Set(
      students.filter((s) => s.isHandRaised).map((s) => s.studentId)
    );

    raisedHands.forEach((id) => {
      if (!pulsingHands.has(id)) {
        setPulsingHands((prev) => new Set([...prev, id]));
        onHandRaiseDetected?.(id);
      }
    });

    setPulsingHands(raisedHands);
  }, [students, onHandRaiseDetected]);

  const sizeConfig = {
    small: 'grid-cols-2 h-32',
    medium: 'grid-cols-2 h-40',
    large: 'grid-cols-2 h-56',
  };

  const shouldShowDetailedView = expandedStudentId !== null;
  const expandedStudent = students.find((s) => s.studentId === expandedStudentId);

  return (
    <motion.div
      className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-secondary/5 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Student Cameras</h3>
            <span className="ml-2 text-xs text-muted-foreground px-2 py-1 rounded bg-secondary/40">
              {students.filter((s) => s.isActive).length}/{students.length} Active
            </span>
          </div>
          {students.some((s) => s.isHandRaised) && (
            <motion.div className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 border border-red-500/50">
              <Hand className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-500">
                {students.filter((s) => s.isHandRaised).length} Hand(s)
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Grid View */}
          {!shouldShowDetailedView && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid ${sizeConfig[gridSize]} gap-2 p-3 overflow-y-auto`}
            >
              {students.map((student, index) => (
                <StudentCameraCard
                  key={student.studentId}
                  student={student}
                  isSelected={selectedStudentId === student.studentId}
                  isPulsing={pulsingHands.has(student.studentId)}
                  onSelect={() => {
                    onStudentSelect?.(student.studentId);
                    setExpandedStudentId(student.studentId);
                  }}
                  index={index}
                />
              ))}
            </motion.div>
          )}

          {/* Expanded View */}
          {shouldShowDetailedView && expandedStudent && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col p-4"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="font-semibold text-sm">{expandedStudent.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedStudentId(null)}
                  className="h-auto p-1"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Expanded Camera Feed */}
              <div className="relative flex-1 rounded-lg overflow-hidden mb-3 group">
                {/* Camera Feed Placeholder */}
                <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground/50" />
                </div>

                {/* Status Overlay */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {expandedStudent.isActive && (
                    <div className="px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/50 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Active
                    </div>
                  )}
                  {expandedStudent.isMuted && (
                    <div className="px-2 py-1 rounded text-xs bg-warning/20 text-warning border border-warning/50">
                      🔇 Muted
                    </div>
                  )}
                </div>

                {/* Hand Raise Indicator */}
                {expandedStudent.isHandRaised && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-500 rounded-lg"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(239, 68, 68, 0.5)',
                        '0 0 20px rgba(239, 68, 68, 0.8)',
                        '0 0 10px rgba(239, 68, 68, 0.5)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Confidence Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold bg-primary/80 text-white">
                  {Math.round(expandedStudent.confidence * 100)}% Confidence
                </div>
              </div>

              {/* Student Info */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-secondary/30 border border-border/50">
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-bold text-sm mt-1">{Math.round(expandedStudent.confidence * 100)}%</p>
                  </div>
                  <div className="p-2 rounded bg-secondary/30 border border-border/50">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-bold text-sm mt-1">
                      {expandedStudent.isHandRaised ? '🖐️ Raised' : '✅ Listening'}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-secondary/30 border border-border/50">
                    <p className="text-muted-foreground">Audio</p>
                    <p className="font-bold text-sm mt-1">{expandedStudent.isMuted ? '🔇' : '🎤'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-2 bg-secondary/5">
        <p className="text-xs text-muted-foreground text-center">
          📹 Live classroom monitoring • Click to expand
        </p>
      </div>
    </motion.div>
  );
}

interface StudentCameraCardProps {
  student: StudentCameraFeed;
  isSelected: boolean;
  isPulsing: boolean;
  onSelect: () => void;
  index: number;
}

function StudentCameraCard({
  student,
  isSelected,
  isPulsing,
  onSelect,
  index,
}: StudentCameraCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-lg overflow-hidden group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isPulsing ? 'ring-2 ring-red-500' : ''}`}
    >
      {/* Camera Feed Background */}
      <div
        className={`w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 group-hover:border-primary/50 transition flex items-center justify-center relative`}
      >
        {/* Camera Icon */}
        <Camera className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary/50 transition" />

        {/* Status Badge */}
        <div className="absolute top-1 right-1">
          {student.isActive ? (
            <motion.div className="w-2.5 h-2.5 rounded-full bg-success" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" />
          )}
        </div>

        {/* Hand Raise Indicator */}
        {student.isHandRaised && (
          <motion.div
            className="absolute inset-0 border-2 border-red-500 rounded-lg flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 10px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.3)',
                '0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 15px rgba(239, 68, 68, 0.5)',
                '0 0 10px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.3)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360, y: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🖐️
            </motion.div>
          </motion.div>
        )}

        {/* Mute Indicator */}
        {student.isMuted && (
          <div className="absolute bottom-1 right-1 text-xs font-bold bg-black/50 text-white px-1.5 py-0.5 rounded">
            🔇
          </div>
        )}

        {/* Name Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
          <p className="text-xs font-semibold text-white truncate">{student.name}</p>
          <p className="text-xs text-white/70">{Math.round(student.confidence * 100)}%</p>
        </div>
      </div>
    </motion.button>
  );
}
