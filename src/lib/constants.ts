// API Routes
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sahayak.com';

// Features
export const FEATURES = [
  {
    id: 'lesson-prep',
    name: 'AI-Powered Lesson Prep',
    description: 'Auto-generate animated PPTs, videos, and localized quizzes',
  },
  {
    id: 'group-divider',
    name: 'Smart Group Divider',
    description: 'Intelligently create balanced student groups',
  },
  {
    id: 'analytics',
    name: 'Performance Analytics',
    description: 'Visualize student progress and identify at-risk students',
  },
  {
    id: 'reports',
    name: 'Daily Student Reports',
    description: 'Automatically generate comprehensive daily reports',
  },
];

// User Roles
export const USER_ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

// Grade Levels
export const GRADES = ['6', '7', '8', '9', '10', '11', '12'] as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
] as const;

// Session Status
export const SESSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

// Color Scheme
export const COLORS = {
  primary: '#7C3AED',
  accent: '#38BDF8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F7F7F7',
  foreground: '#0F0F0F',
} as const;
