/**
 * Firestore Notes Storage Service
 * Stores and retrieves class notes from Firestore
 */

import type { GeneratedNotes } from './notesGenerationService';

export interface StoredClassNote {
  id: string;
  classSessionId: string;
  topic: string;
  grade: string;
  generatedAt: string; // ISO string for Firestore
  summary: string;
  importantPoints: string[];
  questionsAnswered: QAEntry[];
  studentDoubts: StudentDoubtsEntry[];
  teacherFeedback: TeacherFeedback;
  ruralExamples: string[];
  keyConceptsForRevision: string[];
  suggestedHomework: string[];
  conceptDifficulty: 'easy' | 'moderate' | 'difficult';
  estimatedLearningTime: number;
  relatedTopics: string[];
  videoTimestamps?: VideoTimestamp[];
  createdBy: string; // teacherId
  schoolId: string;
  classId: string;
}

export interface QAEntry {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequencyAsked: number;
}

export interface StudentDoubtsEntry {
  doubt: string;
  category: 'concept' | 'application' | 'calculation' | 'other';
  resolution: string;
  affectedStudents: number;
  suggestedReview: string;
}

export interface TeacherFeedback {
  classEngagement: 'excellent' | 'good' | 'average' | 'needs improvement';
  paceAdequacy: 'too fast' | 'appropriate' | 'too slow';
  conceptClarty: 'clear' | 'mostly clear' | 'needs improvement';
  studentParticipation: 'high' | 'moderate' | 'low';
  suggestedImprovements: string[];
  nextClassFocus: string;
  successIndicators: string[];
}

export interface VideoTimestamp {
  timestamp: number;
  description: string;
  conceptCovered: string;
}

class FirestoreNotesService {
  private mockDatabase: Map<string, StoredClassNote> = new Map();

  /**
   * Save generated notes to Firestore
   */
  async saveNotes(notes: GeneratedNotes, teacherId: string, schoolId: string, classId: string): Promise<string> {
    const storedNote: StoredClassNote = {
      id: notes.id,
      classSessionId: notes.classSessionId,
      topic: notes.topic,
      grade: notes.grade,
      generatedAt: notes.generatedAt.toISOString(),
      summary: notes.summary,
      importantPoints: notes.importantPoints,
      questionsAnswered: notes.questionsAnswered,
      studentDoubts: notes.studentDoubts,
      teacherFeedback: notes.teacherFeedback,
      ruralExamples: notes.ruralExamples,
      keyConceptsForRevision: notes.keyConceptsForRevision,
      suggestedHomework: notes.suggestedHomework,
      conceptDifficulty: notes.conceptDifficulty,
      estimatedLearningTime: notes.estimatedLearningTime,
      relatedTopics: notes.relatedTopics,
      videoTimestamps: notes.videoTimestamps,
      createdBy: teacherId,
      schoolId,
      classId,
    };

    // Mock Firestore save
    this.mockDatabase.set(notes.id, storedNote);

    // In production:
    // await db.collection('classNotes').doc(notes.id).set(storedNote);

    return notes.id;
  }

  /**
   * Get notes by ID
   */
  async getNotesById(noteId: string): Promise<StoredClassNote | null> {
    // Mock retrieval
    const note = this.mockDatabase.get(noteId);
    return note || null;

    // In production:
    // const doc = await db.collection('classNotes').doc(noteId).get();
    // return doc.exists ? (doc.data() as StoredClassNote) : null;
  }

  /**
   * Get all notes for a student's class
   */
  async getNotesByClass(schoolId: string, classId: string): Promise<StoredClassNote[]> {
    // Mock query
    const notes = Array.from(this.mockDatabase.values()).filter(
      (note) => note.schoolId === schoolId && note.classId === classId
    );
    return notes.sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );

    // In production:
    // const query = await db.collection('classNotes')
    //   .where('schoolId', '==', schoolId)
    //   .where('classId', '==', classId)
    //   .orderBy('generatedAt', 'desc')
    //   .get();
    // return query.docs.map(doc => doc.data() as StoredClassNote);
  }

  /**
   * Get notes for a specific date
   */
  async getNotesByDate(schoolId: string, classId: string, date: Date): Promise<StoredClassNote[]> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Mock query
    const notes = Array.from(this.mockDatabase.values()).filter((note) => {
      const noteDate = new Date(note.generatedAt);
      return (
        note.schoolId === schoolId &&
        note.classId === classId &&
        noteDate >= startOfDay &&
        noteDate < endOfDay
      );
    });

    return notes;

    // In production:
    // const query = await db.collection('classNotes')
    //   .where('schoolId', '==', schoolId)
    //   .where('classId', '==', classId)
    //   .where('generatedAt', '>=', startOfDay)
    //   .where('generatedAt', '<', endOfDay)
    //   .get();
  }

  /**
   * Get notes by topic
   */
  async getNotesByTopic(schoolId: string, classId: string, topic: string): Promise<StoredClassNote[]> {
    // Mock query
    const notes = Array.from(this.mockDatabase.values()).filter(
      (note) =>
        note.schoolId === schoolId &&
        note.classId === classId &&
        note.topic.toLowerCase().includes(topic.toLowerCase())
    );

    return notes.sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  /**
   * Update notes (for teacher feedback on generated notes)
   */
  async updateNotes(notesId: string, updates: Partial<StoredClassNote>): Promise<void> {
    const existing = this.mockDatabase.get(notesId);
    if (existing) {
      this.mockDatabase.set(notesId, { ...existing, ...updates });
    }

    // In production:
    // await db.collection('classNotes').doc(notesId).update(updates);
  }

  /**
   * Delete notes
   */
  async deleteNotes(notesId: string): Promise<void> {
    this.mockDatabase.delete(notesId);

    // In production:
    // await db.collection('classNotes').doc(notesId).delete();
  }

  /**
   * Search notes
   */
  async searchNotes(schoolId: string, classId: string, query: string): Promise<StoredClassNote[]> {
    const queryLower = query.toLowerCase();
    // Mock search
    const notes = Array.from(this.mockDatabase.values()).filter(
      (note) =>
        note.schoolId === schoolId &&
        note.classId === classId &&
        (note.topic.toLowerCase().includes(queryLower) ||
          note.summary.toLowerCase().includes(queryLower) ||
          note.importantPoints.some((point) => point.toLowerCase().includes(queryLower)))
    );

    return notes;
  }

  /**
   * Get notes statistics for analytics
   */
  async getNotesStatistics(
    schoolId: string,
    classId: string
  ): Promise<{
    totalNotes: number;
    topicsCount: number;
    averageDifficulty: string;
    recentNotes: StoredClassNote[];
  }> {
    const notes = await this.getNotesByClass(schoolId, classId);
    const topics = new Set(notes.map((n) => n.topic));

    const difficulties = {
      easy: notes.filter((n) => n.conceptDifficulty === 'easy').length,
      moderate: notes.filter((n) => n.conceptDifficulty === 'moderate').length,
      difficult: notes.filter((n) => n.conceptDifficulty === 'difficult').length,
    };

    let avgDifficulty = 'moderate';
    if (difficulties.easy > difficulties.difficult) avgDifficulty = 'easy';
    if (difficulties.difficult > difficulties.easy) avgDifficulty = 'difficult';

    return {
      totalNotes: notes.length,
      topicsCount: topics.size,
      averageDifficulty: avgDifficulty,
      recentNotes: notes.slice(0, 5),
    };
  }
}

export const firestoreNotesService = new FirestoreNotesService();
