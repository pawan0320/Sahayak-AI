'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Lightbulb, Volume2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface StudentDoubt {
  id: string;
  studentName: string;
  studentId: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: Date;
}

export interface DoubtResolution {
  explanation: string;
  ruralExample: string;
  keyPoint: string;
  followUpQuestion: string;
  correctionTip?: string;
}

interface DoubtResolutionPanelProps {
  doubt: StudentDoubt | null;
  isOpen: boolean;
  resolution?: DoubtResolution;
  isLoadingResolution?: boolean;
  onClose?: () => void;
  onResolve?: (doubtId: string, resolution: DoubtResolution) => void;
  onAskFollowUp?: (doubtId: string, followUp: string) => void;
}

export function DoubtResolutionPanel({
  doubt,
  isOpen,
  resolution,
  isLoadingResolution = false,
  onClose,
  onResolve,
  onAskFollowUp,
}: DoubtResolutionPanelProps) {
  const [stage, setStage] = useState<'question' | 'explanation' | 'example' | 'followup' | 'resolved'>(
    'question'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [studentResponse, setStudentResponse] = useState('');

  useEffect(() => {
    if (isOpen && doubt) {
      setStage('question');
      setStudentResponse('');
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  }, [isOpen, doubt]);

  if (!isOpen || !doubt) return null;

  const handleNextStage = () => {
    const stages: (typeof stage)[] = ['question', 'explanation', 'example', 'followup', 'resolved'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const handleResolve = () => {
    if (resolution) {
      onResolve?.(doubt.id, resolution);
      setStage('resolved');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 max-w-2xl mx-auto top-1/2 -translate-y-1/2 rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-secondary/10 shadow-xl z-50 flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">Student Doubt Resolution</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Asked by</p>
                  <p className="font-semibold">{doubt.studentName}</p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      doubt.difficulty === 'easy'
                        ? 'bg-success/20 text-success'
                        : doubt.difficulty === 'medium'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {doubt.difficulty === 'easy'
                      ? '✓ Easy'
                      : doubt.difficulty === 'medium'
                        ? '⚡ Medium'
                        : '🔥 Challenging'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {/* Question Stage */}
                {stage === 'question' && (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <p className="text-sm font-semibold text-primary mb-2">📝 Student's Question:</p>
                      <p className="text-base leading-relaxed">{doubt.question}</p>
                    </div>

                    {isLoadingResolution ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                        <motion.div
                          className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <p className="text-sm text-muted-foreground">
                          AI is preparing a simple explanation...
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-lg bg-accent/10 border border-accent/30"
                      >
                        <p className="text-sm font-semibold text-accent mb-2">💡 Simple Explanation:</p>
                        <p className="text-sm leading-relaxed">{resolution?.explanation || 'Generating...'}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Explanation Stage */}
                {stage === 'explanation' && resolution && (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-start gap-3">
                        {isSpeaking && (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                            <Volume2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          </motion.div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary mb-2">🎯 Here's the explanation:</p>
                          <p className="text-sm leading-relaxed">{resolution.explanation}</p>
                        </div>
                      </div>
                    </div>

                    {resolution.correctionTip && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-warning">{resolution.correctionTip}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Example Stage */}
                {stage === 'example' && resolution && (
                  <motion.div
                    key="example"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <div className="flex items-start gap-3">
                        {isSpeaking && (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                            <Volume2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          </motion.div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-accent mb-2">🌾 Real-Life Example (from your village):</p>
                          <p className="text-sm leading-relaxed">{resolution.ruralExample}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                      <p className="text-sm font-semibold text-success mb-2">⭐ Key Point to Remember:</p>
                      <p className="text-sm leading-relaxed">{resolution.keyPoint}</p>
                    </div>
                  </motion.div>
                )}

                {/* Follow-up Stage */}
                {stage === 'followup' && resolution && (
                  <motion.div
                    key="followup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-start gap-3">
                        {isSpeaking && (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                            <Volume2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          </motion.div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary mb-2">❓ Let me ask you:</p>
                          <p className="text-sm leading-relaxed">{resolution.followUpQuestion}</p>
                        </div>
                      </div>
                    </div>

                    <textarea
                      value={studentResponse}
                      onChange={(e) => setStudentResponse(e.target.value)}
                      placeholder="Student response here..."
                      className="w-full p-3 rounded-lg border border-border/50 bg-secondary/30 text-sm resize-none h-20"
                    />
                  </motion.div>
                )}

                {/* Resolved Stage */}
                {stage === 'resolved' && (
                  <motion.div
                    key="resolved"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <CheckCircle className="w-16 h-16 text-success" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-bold text-lg">Doubt Resolved! 🎉</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Great job understanding the concept, {doubt.studentName}!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-6 py-4 bg-secondary/5 flex gap-2 justify-between">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>

              {stage !== 'resolved' && (
                <Button
                  onClick={handleNextStage}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                >
                  {stage === 'followup' ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Resolve
                    </>
                  ) : (
                    <>
                      Next Step →
                    </>
                  )}
                </Button>
              )}

              {stage === 'resolved' && (
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-success to-primary"
                >
                  ✓ Complete
                </Button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-2 flex justify-center gap-2">
              {(['question', 'explanation', 'example', 'followup', 'resolved'] as const).map((s, i) => (
                <motion.div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    stage === s
                      ? 'bg-primary w-8'
                      : ['question', 'explanation', 'example', 'followup', 'resolved'].indexOf(s) <
                          ['question', 'explanation', 'example', 'followup', 'resolved'].indexOf(stage)
                        ? 'bg-success w-4'
                        : 'bg-border/50 w-4'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
