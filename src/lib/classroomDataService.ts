/**
 * Classroom Data Service
 * Manages persistence and retrieval of student interactions, questions, answers, and performance data
 */

export interface StudentInteraction {
  id: number;
  studentId: string;
  studentName: string;
  lessonTopic: string;
  grade: string;
  timestamp: Date;
  question: string;
  studentAnswer: string;
  answerType: 'speak' | 'type';
  aiEvaluation: {
    isCorrect: boolean;
    confidence: number;
    explanation: string;
    followUpQuestion?: string;
    praise: string;
  };
}

export interface LessonSession {
  id: string;
  topic: string;
  grade: string;
  language: string;
  startTime: Date;
  endTime?: Date;
  interactions: StudentInteraction[];
  notes: ClassNote[];
  statistics: SessionStatistics;
}

export interface ClassNote {
  id: number;
  title: string;
  content: string;
  type: 'explanation' | 'qa' | 'summary';
  timestamp: Date;
}

export interface SessionStatistics {
  totalInteractions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageConfidence: number;
  studentParticipation: Map<string, number>;
  performanceTrend: PerformanceMetric[];
}

export interface PerformanceMetric {
  timestamp: Date;
  studentId: string;
  isCorrect: boolean;
  confidence: number;
  responseTime: number;
}

/**
 * ClassroomDataStore - Manages all classroom session data
 * Uses localStorage for persistence with backup capabilities
 */
class ClassroomDataStore {
  private readonly STORAGE_KEY = 'classroom_sessions';
  private readonly MAX_SESSIONS = 50; // Keep last 50 sessions

  /**
   * Save a complete lesson session
   */
  saveLessonSession(session: LessonSession): void {
    const sessions = this.getAllSessions();

    // Add new session
    sessions.unshift(session);

    // Keep only recent sessions
    if (sessions.length > this.MAX_SESSIONS) {
      sessions.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions, this.replacer));
    console.log(`Saved lesson session: ${session.topic}`, session);
  }

  /**
   * Get all recorded lesson sessions
   */
  getAllSessions(): LessonSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    try {
      const sessions = JSON.parse(stored, this.reviver);
      return sessions;
    } catch {
      console.error('Failed to parse stored sessions');
      return [];
    }
  }

  /**
   * Get session by ID
   */
  getSessionById(sessionId: string): LessonSession | null {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  }

  /**
   * Get sessions for a specific topic
   */
  getSessionsByTopic(topic: string): LessonSession[] {
    return this.getAllSessions().filter((s) => s.topic === topic);
  }

  /**
   * Get sessions for a specific grade
   */
  getSessionsByGrade(grade: string): LessonSession[] {
    return this.getAllSessions().filter((s) => s.grade === grade);
  }

  /**
   * Add interaction to a session
   */
  addInteractionToSession(sessionId: string, interaction: StudentInteraction): void {
    const sessions = this.getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);

    if (session) {
      session.interactions.push(interaction);
      session.statistics = this.calculateStatistics(session.interactions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions, this.replacer));
      console.log(`Added interaction to session ${sessionId}`, interaction);
    }
  }

  /**
   * Get student performance history
   */
  getStudentHistory(studentId: string): StudentInteraction[] {
    const sessions = this.getAllSessions();
    const interactions: StudentInteraction[] = [];

    sessions.forEach((session) => {
      session.interactions
        .filter((i) => i.studentId === studentId)
        .forEach((i) => interactions.push(i));
    });

    return interactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get student statistics
   */
  getStudentStats(studentId: string): {
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    averageConfidence: number;
    recentPerformance: PerformanceMetric[];
  } {
    const interactions = this.getStudentHistory(studentId);

    const totalAttempts = interactions.length;
    const correctAnswers = interactions.filter((i) => i.aiEvaluation.isCorrect).length;
    const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
    const averageConfidence =
      totalAttempts > 0
        ? interactions.reduce((sum, i) => sum + i.aiEvaluation.confidence, 0) / totalAttempts
        : 0;

    return {
      totalAttempts,
      correctAnswers,
      accuracy: Math.round(accuracy),
      averageConfidence: Math.round(averageConfidence),
      recentPerformance: interactions
        .slice(0, 10)
        .map((i) => ({
          timestamp: i.timestamp,
          studentId: i.studentId,
          isCorrect: i.aiEvaluation.isCorrect,
          confidence: i.aiEvaluation.confidence,
          responseTime: Math.random() * 30 + 5, // Mock response time (5-35 seconds)
        })),
    };
  }

  /**
   * Clear all stored sessions
   */
  clearAllSessions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Cleared all classroom sessions');
  }

  /**
   * Export sessions data as JSON
   */
  exportSessions(): string {
    const sessions = this.getAllSessions();
    return JSON.stringify(sessions, this.replacer, 2);
  }

  /**
   * Calculate session statistics
   */
  private calculateStatistics(interactions: StudentInteraction[]): SessionStatistics {
    const studentParticipation = new Map<string, number>();
    let correctCount = 0;
    let confidenceSum = 0;

    interactions.forEach((interaction) => {
      // Count participation
      const current = studentParticipation.get(interaction.studentId) || 0;
      studentParticipation.set(interaction.studentId, current + 1);

      // Count correctness
      if (interaction.aiEvaluation.isCorrect) {
        correctCount++;
      }

      // Sum confidence
      confidenceSum += interaction.aiEvaluation.confidence;
    });

    const performanceTrend: PerformanceMetric[] = interactions.map((i) => ({
      timestamp: i.timestamp,
      studentId: i.studentId,
      isCorrect: i.aiEvaluation.isCorrect,
      confidence: i.aiEvaluation.confidence,
      responseTime: Math.random() * 30 + 5,
    }));

    return {
      totalInteractions: interactions.length,
      correctAnswers: correctCount,
      incorrectAnswers: interactions.length - correctCount,
      averageConfidence: interactions.length > 0 ? confidenceSum / interactions.length : 0,
      studentParticipation,
      performanceTrend,
    };
  }

  /**
   * Custom JSON replacer for Date serialization
   */
  private replacer = (key: string, value: any): any => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof Map) {
      return Array.from(value.entries());
    }
    return value;
  };

  /**
   * Custom JSON reviver for Date deserialization
   */
  private reviver = (key: string, value: any): any => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    if (key === 'studentParticipation' && Array.isArray(value)) {
      return new Map(value);
    }
    return value;
  };
}

// Export singleton instance
export const classroomDataStore = new ClassroomDataStore();

/**
 * Utility functions for data analysis
 */
export const classroomAnalytics = {
  /**
   * Get top performing students
   */
  getTopStudents(limit: number = 5): Array<{ studentId: string; accuracy: number; attempts: number }> {
    const sessions = classroomDataStore.getAllSessions();
    const studentStats = new Map<string, { correct: number; total: number }>();

    sessions.forEach((session) => {
      session.interactions.forEach((interaction) => {
        const stats = studentStats.get(interaction.studentId) || { correct: 0, total: 0 };
        stats.total++;
        if (interaction.aiEvaluation.isCorrect) {
          stats.correct++;
        }
        studentStats.set(interaction.studentId, stats);
      });
    });

    return Array.from(studentStats.entries())
      .map(([studentId, stats]) => ({
        studentId,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        attempts: stats.total,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, limit);
  },

  /**
   * Get common mistakes
   */
  getCommonMistakes(limit: number = 5): Array<{ question: string; mistakes: number }> {
    const sessions = classroomDataStore.getAllSessions();
    const mistakes = new Map<string, number>();

    sessions.forEach((session) => {
      session.interactions
        .filter((i) => !i.aiEvaluation.isCorrect)
        .forEach((interaction) => {
          const count = mistakes.get(interaction.question) || 0;
          mistakes.set(interaction.question, count + 1);
        });
    });

    return Array.from(mistakes.entries())
      .map(([question, mistakes]) => ({ question, mistakes }))
      .sort((a, b) => b.mistakes - a.mistakes)
      .slice(0, limit);
  },

  /**
   * Get topic mastery level
   */
  getTopicMastery(topic: string): { mastered: boolean; accuracy: number; attempts: number } {
    const sessions = classroomDataStore.getSessionsByTopic(topic);
    let correct = 0;
    let total = 0;

    sessions.forEach((session) => {
      session.interactions.forEach((interaction) => {
        total++;
        if (interaction.aiEvaluation.isCorrect) {
          correct++;
        }
      });
    });

    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      mastered: accuracy >= 80,
      accuracy,
      attempts: total,
    };
  },
};
