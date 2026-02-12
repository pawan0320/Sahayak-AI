'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Pause, SkipForward, Download, FileText, Users, BarChart3 } from 'lucide-react';
import { AIAvatar } from '@/components/classroom/AIAvatar';
import { HandRaiseDetector } from '@/components/classroom/HandRaiseDetector';
import { StudentInteractionPanel } from '@/components/classroom/StudentInteractionPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface Interaction {
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

interface ClassNote {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
}

export default function ClassroomPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage, setStage] = useState<'intro' | 'explanation' | 'interaction'>('intro');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; id: string } | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [handRaiseCount, setHandRaiseCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const lessonTopic = 'Introduction to Photosynthesis';
  const grade = '10';
  const language = 'en';

  const explanationText =
    'Welcome to today\'s lesson on photosynthesis. Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose. This happens in the chloroplasts of plant cells. The process requires three main inputs: light, water, and carbon dioxide. Through photosynthesis, plants produce oxygen as a byproduct, which is essential for life on Earth.';

  const questions = [
    'What are the two main stages of photosynthesis?',
    'Where does photosynthesis occur in a plant cell?',
    'Why is photosynthesis important for our planet?',
  ];

  // Start the lesson automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      startLesson();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const startLesson = () => {
    setStage('explanation');
    setIsPlaying(true);
    setCurrentMessage('Let me start by explaining today\'s topic...');

    // Simulate lesson flow
    setTimeout(() => {
      setCurrentMessage(explanationText);
      simulateExplanation();
    }, 2000);
  };

  const simulateExplanation = () => {
    let charIndex = 0;
    const displayText = explanationText;

    const displayInterval = setInterval(() => {
      if (charIndex < displayText.length) {
        setCurrentMessage(displayText.substring(0, charIndex));
        charIndex += 3;
        setProgress((charIndex / displayText.length) * 100);
      } else {
        clearInterval(displayInterval);
        setTimeout(() => {
          moveToInteraction();
        }, 2000);
      }
    }, 30);
  };

  const moveToInteraction = () => {
    setStage('interaction');
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setCurrentMessage(questions[0]);
    setIsListening(true);

    // Auto-generate a note from the explanation
    setClassNotes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: 'Photosynthesis Overview',
        content: explanationText,
        timestamp: new Date(),
      },
    ]);
  };

  const handleHandRaised = (hands: any[]) => {
    setHandRaiseCount(hands.length);
  };

  const handleSelectStudent = (studentId: string, studentName: string) => {
    setSelectedStudent({ name: studentName, id: studentId });
    setIsListening(true);
  };

  const handleInteractionComplete = (interaction: Interaction) => {
    // Save interaction with full data
    const enhancedInteraction: Interaction = {
      ...interaction,
      studentId: selectedStudent?.id || 'unknown',
      confidence: interaction.confidence,
    };

    setInteractions((prev) => [...prev, enhancedInteraction]);
    setSelectedStudent(null);
    setIsListening(false);

    // Generate comprehensive notes from interaction
    setClassNotes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Q&A: ${enhancedInteraction.studentName}`,
        content: `Question: ${enhancedInteraction.studentQuestion}\n\nStudent Response: ${enhancedInteraction.aiResponse}\n\nExplanation: ${enhancedInteraction.explanation || 'N/A'}\n\nCorrect: ${enhancedInteraction.isCorrect ? 'Yes' : 'No'} (${enhancedInteraction.confidence}% confidence)`,
        timestamp: enhancedInteraction.timestamp,
      },
    ]);

    // Move to next question or end lesson
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentMessage(questions[nextIndex]);
    } else {
      endLesson();
    }
  };

  const endLesson = () => {
    setStage('intro');
    setIsPlaying(false);
    setCurrentMessage('Thank you for participating in today\'s lesson!');
  };

  const downloadNotes = () => {
    const notesText = classNotes.map((note) => `${note.title}\n${note.content}\n\n`).join('\n---\n\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(notesText));
    element.setAttribute('download', `class-notes-${new Date().toISOString()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1">
          <Header title="AI Classroom" showMenu={true} />

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {lessonTopic}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Grade {grade}
                </span>
                <span>•</span>
                <span>Language: English</span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {handRaiseCount} hands raised
                </span>
              </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Avatar Section - Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="p-8 bg-gradient-to-br from-background to-secondary/10 border-border/50 min-h-96 flex items-center justify-center">
                  <AIAvatar
                    isSpoken={isPlaying}
                    isSpeaking={isPlaying}
                    message={currentMessage}
                    isListening={isListening}
                  />
                </Card>
              </motion.div>

              {/* Stats & Controls - Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Session Stats */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-border/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Session Stats
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Interactions</p>
                      <p className="text-2xl font-bold">{interactions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Progress</p>
                      <div className="w-full bg-secondary/40 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="bg-gradient-to-r from-primary to-accent rounded-full h-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                      <p className="text-2xl font-bold text-success">
                        {interactions.filter((i) => i.isCorrect).length}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Controls */}
                <Card className="p-4 bg-gradient-to-br from-background to-secondary/10 border-border/50">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex-1 gap-2 ${isPlaying ? 'bg-warning' : 'bg-primary'}`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {/* Notes Preview */}
                <Card className="p-4 bg-gradient-to-br from-background to-secondary/10 border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Notes ({classNotes.length})
                    </h4>
                    {classNotes.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={downloadNotes} className="h-auto p-1">
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {classNotes.length > 0 ? (
                      classNotes.map((note) => (
                        <div key={note.id} className="text-xs p-2 bg-secondary/20 rounded border border-border/50">
                          <p className="font-medium line-clamp-1">{note.title}</p>
                          <p className="text-muted-foreground line-clamp-2">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Notes will appear as lesson progresses
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Hand Raise Detector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <HandRaiseDetector
                isActive={stage === 'interaction'}
                onHandRaised={handleHandRaised}
                onSelectStudent={handleSelectStudent}
              />
            </motion.div>

            {/* Recent Interactions */}
            {interactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-6 bg-gradient-to-br from-background to-secondary/10 border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
                  <div className="space-y-3">
                    {interactions.map((interaction, index) => (
                      <motion.div
                        key={interaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/50 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium mb-1">{interaction.studentName}</p>
                            <p className="text-sm text-muted-foreground mb-2">{interaction.studentQuestion}</p>
                            <p className="text-sm">{interaction.aiResponse}</p>
                          </div>
                          {interaction.isCorrect ? (
                            <span className="ml-4 px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                              ✓ Correct
                            </span>
                          ) : (
                            <span className="ml-4 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
                              ⚠ Corrected
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Student Interaction Modal */}
      <StudentInteractionPanel
        selectedStudent={selectedStudent}
        isInteracting={!!selectedStudent}
        question={currentMessage}
        onInteractionComplete={handleInteractionComplete}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
