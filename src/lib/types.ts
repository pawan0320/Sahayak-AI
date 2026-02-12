export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  phone?: string;
  school?: string;
  profileImageUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  email?: string;
  faceId?: string;
  attendance: number;
  avgScore: number;
  isAtRisk: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  grade: string;
  language: string;
  content: {
    ppt?: string;
    video?: string;
    quiz?: string;
    notes?: string;
  };
  createdAt: Date;
}

export interface ClassSession {
  id: string;
  teacherId: string;
  lessonId: string;
  startTime: Date;
  endTime?: Date;
  studentCount: number;
  questions: Question[];
  aiNotes?: string;
}

export interface Question {
  id: string;
  content: string;
  studentAnswer?: string;
  aiExplanation?: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  students: String[];
  createdAt: Date;
}

export interface Schedule {
  id: string;
  teacherId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'meeting' | 'event';
  room?: string;
  description?: string;
  joinLink?: string;
}

export interface Report {
  id: string;
  studentId: string;
  date: Date;
  attendance: boolean;
  participation: number;
  performance: number;
  aiInsights?: string;
  teacherFeedback?: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  location: string;
  principalName?: string;
  teacherCount: number;
  studentCount: number;
  isActive: boolean;
}
// Authentication Types
export type UserRole = 'teacher' | 'student' | 'admin';

export interface AuthUser extends User {
  lastLogin?: Date;
  isBiometricEnabled?: boolean;
  faceId?: string;
}

export interface OTPRequest {
  phone: string;
  method: 'sms' | 'email';
}

export interface FaceData {
  embedding: number[];
  timestamp: Date;
  quality: number;
}

export interface TeacherProfile extends User {
  role: 'teacher';
  qualifications?: string[];
  experience?: number;
  specialization?: string[];
  classSections?: string[];
  totalStudents?: number;
  bio?: string;
}

export interface StudentProfile extends User {
  role: 'student';
  rollNumber: string;
  className: string;
  faceId?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface AdminProfile extends User {
  role: 'admin';
  permissions?: string[];
  schoolId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  attendanceRate: number;
  atRiskStudents: number;
  avgQuizScore: number;
  lessonsPrepared: number;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  rollNumber: string;
  attendance: number;
  quizAvg: number;
  lastActive: Date;
  status: 'good' | 'average' | 'at-risk';
}