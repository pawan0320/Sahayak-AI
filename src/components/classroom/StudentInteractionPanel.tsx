'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Type,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Volume2,
  Copy,
  Download,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Interaction {
  id: number;
  studentId: string;
  studentName: string;
  studentQuestion: string;
  aiResponse: string;
  isCorrect: boolean;
  explanation?: string;
  followUp?: string;
  timestamp: Date;
  confidence: number;
}

interface StudentInteractionPanelProps {
  selectedStudent: { name: string; id: string } | null;
  isInteracting: boolean;
  question: string;
  onInteractionComplete: (interaction: Interaction) => void;
  onClose: () => void;
}

type InputMode = 'speak' | 'type';
type Stage = 'question' | 'answer' | 'feedback';

export function StudentInteractionPanel({
  selectedStudent,
  isInteracting,
  question,
  onInteractionComplete,
  onClose,
}: StudentInteractionPanelProps) {
  const [stage, setStage] = useState<Stage>('question');
  const [inputMode, setInputMode] = useState<InputMode>('speak');
  const [recording, setRecording] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    praise?: string;
    explanation?: string;
    followUp?: string;
    confidence: number;
  } | null>(null);
  const recordingTimeRef = useRef(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample correct answers for evaluation
  const correctAnswersDatabase: Record<string, string[]> = {
    'What is photosynthesis and why is it important?': [
      'process where plants make food from sunlight',
      'converts light energy into chemical energy',
      'produces oxygen and glucose',
      'important for producing oxygen we breathe',
      'feeds the entire food chain',
    ],
    'What are the two main stages of photosynthesis?': [
      'light-dependent and light-independent',
      'light reactions and calvin cycle',
      'light and dark reactions',
    ],
    'Where does photosynthesis occur in a plant cell?': [
      'chloroplasts',
      'in the leaves inside chloroplasts',
      'thylakoid and stroma',
    ],
    'Why is photosynthesis important for our planet?': [
      'produces oxygen',
      'removes carbon dioxide',
      'basis of food chain',
      'sustains life on earth',
    ],
  };

  // Simulate speech-to-text recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecording(true);
      recordingTimeRef.current = 0;

      // Simulate recording for 5 seconds
      recordingIntervalRef.current = setInterval(() => {
        recordingTimeRef.current += 1;
        if (recordingTimeRef.current >= 5) {
          stopRecording();
        }
      }, 1000);

      // Stop the stream immediately (just showing intent)
      stream.getTracks().forEach((track) => track.stop());

      // Simulate speech-to-text conversion
      setTimeout(() => {
        const mockAnswers = [
          'Photosynthesis is the process where plants use sunlight to make food from carbon dioxide and water.',
          'Plants absorb light energy and convert it into chemical energy stored in glucose molecules.',
          'The process happens in the leaves where chloroplasts contain the pigment chlorophyll.',
          'It produces oxygen and glucose which are essential for plant growth and respiration.',
        ];
        setStudentAnswer(mockAnswers[Math.floor(Math.random() * mockAnswers.length)]);
      }, 1500);
    } catch (err) {
      console.error('Microphone access denied:', err);
      // Fallback to mock answer
      setTimeout(() => {
        setStudentAnswer(
          'Photosynthesis is when plants make their own food using sunlight, water, and carbon dioxide.',
        );
      }, 1500);
    }
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setRecording(false);
  };

  // Evaluate student answer
  const evaluateAnswer = () => {
    const answer = inputMode === 'speak' ? studentAnswer : typedAnswer;

    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    const correctAnswers = correctAnswersDatabase[question] || [];
    const answerLower = answer.toLowerCase();

    // Simple evaluation: check key terms
    let matchCount = 0;
    correctAnswers.forEach((correctAnswer) => {
      const correctLower = correctAnswer.toLowerCase();
      correctLower.split(' ').forEach((word) => {
        if (word.length > 3 && answerLower.includes(word)) {
          matchCount++;
        }
      });
    });

    const confidence = Math.min(100, (matchCount / 5) * 100);
    const isCorrect = confidence >= 60;

    const feedbackData = {
      isCorrect,
      confidence: Math.round(confidence),
      praise: isCorrect
        ? '🌟 Excellent answer! You demonstrated a clear understanding of the concept.'
        : '👍 Good effort! Your answer shows understanding of some key concepts.',
      explanation: isCorrect
        ? `Your answer correctly identified the key components of ${question}. The terms and concepts you mentioned align well with scientific definitions.`
        : `Your answer has some correct elements, but let me clarify a few points. The essential concept here is...`,
      followUp: isCorrect
        ? 'Can you explain how this relates to the energy cycle in ecosystems?'
        : 'Let me re-explain: [Detailed explanation here]. Now, can you try to answer in your own words?',
    };

    setFeedback(feedbackData);
    setStage('feedback');
  };

  const completeInteraction = () => {
    if (!selectedStudent || !feedback) return;

    const interaction: Interaction = {
      id: Date.now(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentQuestion: question,
      aiResponse: inputMode === 'speak' ? studentAnswer : typedAnswer,
      isCorrect: feedback.isCorrect,
      explanation: feedback.explanation,
      followUp: feedback.followUp,
      timestamp: new Date(),
      confidence: feedback.confidence,
    };

    onInteractionComplete(interaction);
    resetPanel();
  };

  const resetPanel = () => {
    setStage('question');
    setInputMode('speak');
    setStudentAnswer('');
    setTypedAnswer('');
    setFeedback(null);
    recordingTimeRef.current = 0;
    onClose();
  };

  if (!selectedStudent || !isInteracting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-gradient-to-br from-background to-secondary/20 rounded-2xl border-2 border-accent/50 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div className="text-3xl">👤</motion.div>
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="font-bold text-lg">{selectedStudent.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {selectedStudent.id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetPanel}
                className="rounded-full hover:bg-destructive/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-96">
            <AnimatePresence mode="wait">
              {stage === 'question' && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Question for {selectedStudent.name}
                    </p>
                    <p className="text-xl font-bold">{question}</p>
                  </div>

                  {/* Input Mode Selector */}
                  <div className="flex gap-3">
                    <Button
                      variant={inputMode === 'speak' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => setInputMode('speak')}
                    >
                      <Mic className="w-4 h-4" />
                      Speak Answer
                    </Button>
                    <Button
                      variant={inputMode === 'type' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => setInputMode('type')}
                    >
                      <Type className="w-4 h-4" />
                      Type Answer
                    </Button>
                  </div>

                  {/* Answer Recording/Input */}
                  {inputMode === 'speak' ? (
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-secondary/20 border-2 border-accent/30 text-center">
                        {recording ? (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="space-y-4"
                          >
                            <div className="flex justify-center">
                              <div className="inline-block">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center"
                                >
                                  <Mic className="w-8 h-8 text-accent" />
                                </motion.div>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-accent">
                              Recording... ({recordingTimeRef.current}s)
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Speak clearly. Maximum 5 seconds.
                            </p>
                          </motion.div>
                        ) : studentAnswer ? (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">Recorded Answer</p>
                            <div className="p-4 rounded-lg bg-background/50 border border-border text-left">
                              <p className="text-sm leading-relaxed">{studentAnswer}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 w-full"
                              onClick={() => setStudentAnswer('')}
                            >
                              Re-record
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Click button to start recording your answer
                          </p>
                        )}
                      </div>

                      <Button
                        size="lg"
                        className={`w-full gap-2 ${
                          recording ? 'bg-destructive hover:bg-destructive/90' : 'bg-gradient-to-r from-accent to-primary'
                        }`}
                        onClick={recording ? stopRecording : startRecording}
                      >
                        {recording ? (
                          <>
                            <MicOff className="w-5 h-5" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            {studentAnswer ? 'Start Over' : 'Start Recording'}
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-32 p-4 rounded-lg bg-secondary/20 border border-border/50 focus:border-accent focus:outline-none resize-none placeholder:text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {typedAnswer.length} characters
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-success hover:bg-success/90"
                    onClick={evaluateAnswer}
                    disabled={inputMode === 'speak' ? !studentAnswer : !typedAnswer.trim()}
                  >
                    <Send className="w-5 h-5" />
                    Submit Answer
                  </Button>
                </motion.div>
              )}

              {stage === 'feedback' && feedback && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Correctness Badge */}
                  <div
                    className={`p-6 rounded-xl border-2 flex items-center justify-between ${
                      feedback.isCorrect
                        ? 'bg-success/10 border-success/50'
                        : 'bg-warning/10 border-warning/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {feedback.isCorrect ? (
                        <CheckCircle className="w-8 h-8 text-success" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-warning" />
                      )}
                      <div>
                        <p className="font-bold text-lg">
                          {feedback.isCorrect ? '✓ Correct!' : '○ Needs Correction'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {feedback.confidence}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Praise */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-lg bg-accent/10 border border-accent/30"
                  >
                    <p className="font-semibold text-sm mb-2">AI Feedback</p>
                    <p className="text-sm leading-relaxed">{feedback.praise}</p>
                  </motion.div>

                  {/* Explanation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg bg-primary/10 border border-primary/30"
                  >
                    <p className="font-semibold text-sm mb-2">Explanation</p>
                    <p className="text-sm leading-relaxed">{feedback.explanation}</p>
                  </motion.div>

                  {/* Follow-up Question */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-lg bg-secondary/20 border border-border/50"
                  >
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Follow-up Question
                    </p>
                    <p className="text-sm leading-relaxed italic">{feedback.followUp}</p>
                  </motion.div>

                  {/* Student's Answer Review */}
                  <div className="p-4 rounded-lg bg-background/50 border border-border">
                    <p className="font-semibold text-sm mb-2 text-muted-foreground">Student's Response</p>
                    <p className="text-sm leading-relaxed">
                      {inputMode === 'speak' ? studentAnswer : typedAnswer}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => setStage('question')}
                    >
                      Back to Question
                    </Button>
                    <Button
                      className="flex-1 gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90"
                      onClick={completeInteraction}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Interaction
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
