'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Zap,
  MessageCircle,
  Download,
  Share2,
  Bookmark,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { StoredClassNote } from '@/lib/firestoreNotesService';

interface StudentDashboardNotesProps {
  schoolId: string;
  classId: string;
  studentGrade: string;
  isLoading?: boolean;
}

interface NotesCard extends StoredClassNote {
  isBookmarked?: boolean;
}

export function StudentDashboardNotes({
  schoolId,
  classId,
  studentGrade,
  isLoading = false,
}: StudentDashboardNotesProps) {
  const [notes, setNotes] = useState<NotesCard[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NotesCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(new Set());
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Mock notes data
  useEffect(() => {
    const mockNotes: NotesCard[] = [
      {
        id: 'note-1',
        classSessionId: 'session-1',
        topic: 'Fractions',
        grade: studentGrade,
        generatedAt: new Date(Date.now() - 86400000).toISOString(),
        summary:
          'Learned about fractions, how to add, subtract, and convert between improper fractions and mixed numbers.',
        importantPoints: [
          '• Fractions represent parts of a whole',
          '• Common denominator needed for addition',
          '• Simplify fractions to lowest terms',
          '• Mixed numbers = whole number + fraction',
        ],
        questionsAnswered: [
          {
            question: 'How to add fractions with different denominators?',
            answer: 'Find common denominator, then add numerators',
            difficulty: 'medium',
            frequencyAsked: 3,
          },
        ],
        studentDoubts: [
          {
            doubt: 'Why do we need common denominators?',
            category: 'concept',
            resolution: 'Because we can only add similar parts',
            affectedStudents: 2,
            suggestedReview: 'Practice with visual models',
          },
        ],
        teacherFeedback: {
          classEngagement: 'excellent',
          paceAdequacy: 'appropriate',
          conceptClarty: 'clear',
          studentParticipation: 'high',
          suggestedImprovements: ['More practice problems'],
          nextClassFocus: 'Multiplying fractions',
          successIndicators: ['Good participation', 'Clear understanding'],
        },
        ruralExamples: [
          'Dividing crops among family members',
          'Measuring ingredients for recipes',
        ],
        keyConceptsForRevision: [
          'Definition of fractions',
          'Adding fractions with common denominators',
          'Converting mixed numbers',
        ],
        suggestedHomework: ['Solve 5 practice problems', 'Explain fractions to family'],
        conceptDifficulty: 'moderate',
        estimatedLearningTime: 45,
        relatedTopics: ['Decimals', 'Percentages', 'Ratios'],
        createdBy: 'teacher-1',
        schoolId,
        classId,
        isBookmarked: false,
      },
      {
        id: 'note-2',
        classSessionId: 'session-2',
        topic: 'Photosynthesis',
        grade: studentGrade,
        generatedAt: new Date(Date.now() - 172800000).toISOString(),
        summary:
          'Understanding the process of photosynthesis, how plants convert sunlight into food, and its importance.',
        importantPoints: [
          '• Photosynthesis converts light energy to chemical energy',
          '• Occurs in chloroplasts with chlorophyll',
          '• Requires sunlight, water, and CO₂',
          '• Produces oxygen and glucose',
        ],
        questionsAnswered: [
          {
            question: 'Why do plants need photosynthesis?',
            answer: 'To make food (glucose) for energy and growth',
            difficulty: 'easy',
            frequencyAsked: 4,
          },
        ],
        studentDoubts: [
          {
            doubt: 'How does photosynthesis happen at night?',
            category: 'concept',
            resolution: 'Photosynthesis only occurs during the day with sunlight',
            affectedStudents: 1,
            suggestedReview: 'Review the light and dark reactions',
          },
        ],
        teacherFeedback: {
          classEngagement: 'good',
          paceAdequacy: 'appropriate',
          conceptClarty: 'mostly clear',
          studentParticipation: 'moderate',
          suggestedImprovements: ['Show more practical examples'],
          nextClassFocus: 'Respiration process',
          successIndicators: ['Basic concepts understood'],
        },
        ruralExamples: ['Why crops grow better in sunlight', 'Importance of water for plants'],
        keyConceptsForRevision: [
          'Definition of photosynthesis',
          'Role of chlorophyll',
          'Products of photosynthesis',
        ],
        suggestedHomework: ['Observe plant growth', 'Draw photosynthesis diagram'],
        conceptDifficulty: 'moderate',
        estimatedLearningTime: 50,
        relatedTopics: ['Respiration', 'Plant structure', 'Energy'],
        createdBy: 'teacher-1',
        schoolId,
        classId,
        isBookmarked: false,
      },
      {
        id: 'note-3',
        classSessionId: 'session-3',
        topic: 'Ancient India',
        grade: studentGrade,
        generatedAt: new Date(Date.now() - 259200000).toISOString(),
        summary:
          'Study of Ancient Indian civilizations, the Indus Valley Civilization, Vedic period, and the Mauryan Empire.',
        importantPoints: [
          '• Indus Valley Civilization (3300-1300 BCE)',
          '• Well-planned cities like Harappa and Mohenjo-daro',
          '• Vedic period introduced Aryans',
          '• Mauryan Empire under Ashoka',
        ],
        questionsAnswered: [
          {
            question: 'What made Indus Valley Civilization advanced?',
            answer: 'Urban planning, drainage systems, and organized governance',
            difficulty: 'medium',
            frequencyAsked: 2,
          },
        ],
        studentDoubts: [],
        teacherFeedback: {
          classEngagement: 'excellent',
          paceAdequacy: 'too slow',
          conceptClarty: 'clear',
          studentParticipation: 'high',
          suggestedImprovements: ['Speed up lessons', 'More interactive activities'],
          nextClassFocus: 'Vedic period in detail',
          successIndicators: ['Excellent engagement', 'Good Q&A'],
        },
        ruralExamples: ['Ancient farming techniques', 'Trade routes and commerce'],
        keyConceptsForRevision: ['Timeline of civilizations', 'Key characteristics'],
        suggestedHomework: ['Research one civilization', 'Make a timeline poster'],
        conceptDifficulty: 'easy',
        estimatedLearningTime: 40,
        relatedTopics: ['Medieval India', 'Medieval Europe', 'Trade and Commerce'],
        createdBy: 'teacher-2',
        schoolId,
        classId,
        isBookmarked: false,
      },
    ];

    setNotes(mockNotes);
    setFilteredNotes(mockNotes);
  }, [schoolId, classId, studentGrade]);

  // Filter logic
  useEffect(() => {
    let filtered = notes;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.topic.toLowerCase().includes(query) ||
          note.summary.toLowerCase().includes(query)
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((note) => note.conceptDifficulty === selectedDifficulty);
    }

    // Topic filter (using first topic if multiple)
    if (selectedTopic !== 'all') {
      filtered = filtered.filter((note) => note.topic === selectedTopic);
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedDifficulty, selectedTopic]);

  const toggleBookmark = (noteId: string) => {
    setBookmarkedNotes((prev) => {
      const updated = new Set(prev);
      if (updated.has(noteId)) updated.delete(noteId);
      else updated.add(noteId);
      return updated;
    });
  };

  const uniqueTopics = ['all', ...new Set(notes.map((note) => note.topic))];
  const difficulties = ['all', 'easy', 'moderate', 'difficult'];

  if (isLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 animate-pulse"
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">📚 AI Generated Notes</h2>
          <p className="text-muted-foreground">
            Comprehensive notes from your classes, auto-generated by AI
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes by topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-secondary/30 focus:border-primary focus:outline-none transition text-sm"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Difficulty:</span>
            </div>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedDifficulty === diff
                    ? 'bg-primary text-white'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
                }`}
              >
                {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs font-semibold text-muted-foreground">Topic:</span>
            </div>
            {uniqueTopics.slice(0, 4).map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedTopic === topic
                    ? 'bg-accent text-white'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
                }`}
              >
                {topic === 'all' ? 'All Topics' : topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <AnimatePresence mode="wait">
        {filteredNotes.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No notes found. Check back after class!</p>
          </motion.div>
        ) : (
          <motion.div key="notes" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card
                  className="relative overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  onClick={() =>
                    setExpandedNoteId(
                      expandedNoteId === note.id ? null : note.id
                    )
                  }
                >
                  {/* Gradient corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />

                  {/* Content */}
                  <div className="relative p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-lg">{note.topic}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(note.generatedAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Difficulty badge */}
                      <div
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          note.conceptDifficulty === 'easy'
                            ? 'bg-success/20 text-success'
                            : note.conceptDifficulty === 'moderate'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {note.conceptDifficulty === 'easy'
                          ? '✓ Easy'
                          : note.conceptDifficulty === 'moderate'
                            ? '⚡ Moderate'
                            : '🔥 Difficult'}
                      </div>
                    </div>

                    {/* Summary snippet */}
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.summary}</p>

                    {/* Key stats */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-semibold">
                          {note.importantPoints.length} Key Points
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/20">
                        <MessageCircle className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent font-semibold">
                          {note.questionsAnswered.length} Q&A
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-warning/10 border border-warning/20">
                        <Clock className="w-3 h-3 text-warning" />
                        <span className="text-xs text-warning font-semibold">
                          {note.estimatedLearningTime}m
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(note.id);
                        }}
                        className={`flex-1 h-auto py-1 text-xs ${
                          bookmarkedNotes.has(note.id)
                            ? 'bg-primary/20 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex-1 h-auto py-1 text-xs text-muted-foreground"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Expanded view */}
                <AnimatePresence>
                  {expandedNoteId === note.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3"
                    >
                      {/* Full view content */}
                      <div>
                        <h4 className="font-bold text-sm mb-2">📝 Summary</h4>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {note.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">⭐ Important Points</h4>
                        <ul className="text-xs space-y-1">
                          {note.importantPoints.slice(0, 4).map((point, i) => (
                            <li key={i} className="text-muted-foreground">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {note.ruralExamples.length > 0 && (
                        <div>
                          <h4 className="font-bold text-sm mb-2">🌾 Real-Life Examples</h4>
                          <ul className="text-xs space-y-1">
                            {note.ruralExamples.map((example, i) => (
                              <li key={i} className="text-muted-foreground">
                                • {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {note.suggestedHomework.length > 0 && (
                        <div>
                          <h4 className="font-bold text-sm mb-2">📌 Suggested Homework</h4>
                          <ul className="text-xs space-y-1">
                            {note.suggestedHomework.slice(0, 3).map((hw, i) => (
                              <li key={i} className="text-muted-foreground">
                                ☐ {hw}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-auto py-1.5 text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-auto py-1.5 text-xs"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Ask AI
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics footer */}
      {filteredNotes.length > 0 && (
        <motion.div
          className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{filteredNotes.length}</p>
            <p className="text-xs text-muted-foreground">Notes Available</p>
          </div>
          <div className="text-center border-l border-r border-border/50">
            <p className="text-2xl font-bold text-accent">
              {Math.round(
                filteredNotes.reduce((sum, note) => sum + note.estimatedLearningTime, 0) /
                  filteredNotes.length
              )}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Study Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{bookmarkedNotes.size}</p>
            <p className="text-xs text-muted-foreground">Saved</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
