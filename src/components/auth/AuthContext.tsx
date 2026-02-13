'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, TeacherProfile, StudentProfile, AdminProfile } from '@/lib/authService';

export type UserRole = 'teacher' | 'student' | 'admin';

export interface AuthContextType {
  currentUser: any;
  userRole: UserRole | null;
  teacherProfile: TeacherProfile | null;
  studentProfile: StudentProfile | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Teacher methods
  teacherSignup: (data: any) => Promise<TeacherProfile>;
  teacherLogin: (email: string, password: string) => Promise<TeacherProfile>;
  teacherLoginWithFace: (uid: string) => Promise<TeacherProfile>;

  // Student methods
  studentSignup: (data: any) => Promise<StudentProfile>;
  studentLogin: (rollNo: string, schoolCode: string, pin: string) => Promise<StudentProfile>;

  // Admin methods
  adminSignup: (data: any) => Promise<AdminProfile>;
  adminLogin: (email: string, password: string) => Promise<AdminProfile>;

  // Common methods
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const role = await authService.getUserRole(user.uid);
          setUserRole(role);

          let profileData: any = null;

          if (role === 'teacher') {
            const profile = await authService.getTeacherProfile(user.uid);
            setTeacherProfile(profile);
            profileData = profile;
          } else if (role === 'admin') {
            const profile = await authService.getAdminProfile(user.uid);
            setAdminProfile(profile);
            profileData = profile;
          }

          // Enhance user object with metadata for notifications
          const enhancedUser = {
            ...user,
            role,
            schoolId: profileData?.schoolCode || profileData?.school || 'default',
          };
          setCurrentUser(enhancedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Teacher signup
  const handleTeacherSignup = useCallback(async (data: any): Promise<TeacherProfile> => {
    setIsLoading(true);
    try {
      const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);

      const profile = await authService.teacherSignup(data);
      const firebaseUser = authService.getCurrentUser();
      const enhancedUser = {
        ...firebaseUser,
        role: 'teacher',
        schoolId: profile.school || 'default',
      };
      setCurrentUser(enhancedUser);
      setUserRole('teacher');
      setTeacherProfile(profile);
      localStorage.setItem('userRole', 'teacher');
      localStorage.setItem('uid', profile.uid);

      return profile;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Teacher login
  const handleTeacherLogin = useCallback(async (email: string, password: string): Promise<TeacherProfile> => {
    setIsLoading(true);
    try {
      const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);

      const profile = await authService.teacherLogin(email, password, deviceId);
      const firebaseUser = authService.getCurrentUser();
      const enhancedUser = {
        ...firebaseUser,
        role: 'teacher',
        schoolId: profile.school || 'default',
      };
      setCurrentUser(enhancedUser);
      setUserRole('teacher');
      setTeacherProfile(profile);
      localStorage.setItem('userRole', 'teacher');
      localStorage.setItem('uid', profile.uid);

      return profile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Teacher face login
  const handleTeacherFaceLogin = useCallback(async (uid: string): Promise<TeacherProfile> => {
    setIsLoading(true);
    try {
      const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);

      const profile = await authService.teacherLoginWithFace(uid, deviceId);
      const enhancedUser = {
        uid,
        role: 'teacher',
        schoolId: profile.school || 'default',
      };
      setCurrentUser(enhancedUser);
      setUserRole('teacher');
      setTeacherProfile(profile);
      localStorage.setItem('userRole', 'teacher');
      localStorage.setItem('uid', profile.uid);

      return profile;
    } catch (error) {
      console.error('Face login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Student signup
  const handleStudentSignup = useCallback(async (data: any): Promise<StudentProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.studentSignup(data);
      const studentUser = {
        uid: profile.rollNo,
        role: 'student',
        schoolId: profile.schoolCode || 'default',
      };
      setCurrentUser(studentUser);
      setUserRole('student');
      setStudentProfile(profile);
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('rollNo', profile.rollNo);
      localStorage.setItem('schoolCode', profile.schoolCode);

      return profile;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Student login
  const handleStudentLogin = useCallback(
    async (rollNo: string, schoolCode: string, pin: string): Promise<StudentProfile> => {
      setIsLoading(true);
      try {
        const profile = await authService.studentLogin(rollNo, schoolCode, pin);
        const studentUser = {
          uid: rollNo,
          role: 'student',
          schoolId: schoolCode || 'default',
        };
        setCurrentUser(studentUser);
        setUserRole('student');
        setStudentProfile(profile);
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('rollNo', profile.rollNo);
        localStorage.setItem('schoolCode', profile.schoolCode);

        return profile;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Admin signup
  const handleAdminSignup = useCallback(async (data: any): Promise<AdminProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.adminSignup(data);
      const firebaseUser = authService.getCurrentUser();
      const enhancedUser = {
        ...firebaseUser,
        role: 'admin',
        schoolId: profile.schoolCode || 'default',
      };
      setCurrentUser(enhancedUser);
      setUserRole('admin');
      setAdminProfile(profile);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('uid', profile.uid);

      return profile;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Admin login
  const handleAdminLogin = useCallback(async (email: string, password: string): Promise<AdminProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.adminLogin(email, password);
      const firebaseUser = authService.getCurrentUser();
      const enhancedUser = {
        ...firebaseUser,
        role: 'admin',
        schoolId: profile.schoolCode || 'default',
      };
      setCurrentUser(enhancedUser);
      setUserRole('admin');
      setAdminProfile(profile);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('uid', profile.uid);

      return profile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const handleLogout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      setUserRole(null);
      setTeacherProfile(null);
      setStudentProfile(null);
      setAdminProfile(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('uid');
      localStorage.removeItem('rollNo');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh profile
  const handleRefreshProfile = useCallback(async (): Promise<void> => {
    try {
      if (userRole === 'teacher' && currentUser) {
        const profile = await authService.getTeacherProfile(currentUser.uid);
        setTeacherProfile(profile);
      } else if (userRole === 'student' && studentProfile) {
        const profile = await authService.getStudentProfile(studentProfile.rollNo);
        setStudentProfile(profile);
      } else if (userRole === 'admin' && currentUser) {
        const profile = await authService.getAdminProfile(currentUser.uid);
        setAdminProfile(profile);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  }, [userRole, currentUser, studentProfile]);

  const value: AuthContextType = {
    currentUser,
    userRole,
    teacherProfile,
    studentProfile,
    adminProfile,
    isLoading,
    isAuthenticated: !!currentUser || !!studentProfile,

    teacherSignup: handleTeacherSignup,
    teacherLogin: handleTeacherLogin,
    teacherLoginWithFace: handleTeacherFaceLogin,

    studentSignup: handleStudentSignup,
    studentLogin: handleStudentLogin,

    adminSignup: handleAdminSignup,
    adminLogin: handleAdminLogin,

    logout: handleLogout,
    refreshProfile: handleRefreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
