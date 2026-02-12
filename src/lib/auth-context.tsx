'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthUser, AuthState, UserRole } from './types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithOTP: (phone: string, otp: string, role: UserRole) => Promise<void>;
  loginWithFace: (faceData: any, role: UserRole) => Promise<void>;
  signup: (userData: any, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateBiometric: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  // Mock authentication functions
  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role,
        lastLogin: new Date(),
        isBiometricEnabled: false,
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.',
      }));
      throw err;
    }
  }, []);

  const loginWithOTP = useCallback(async (phone: string, otp: string, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        phone,
        email: `user${Math.random().toString(36).substr(2, 5)}@school.com`,
        name: phone,
        role,
        lastLogin: new Date(),
        isBiometricEnabled: false,
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'OTP verification failed.',
      }));
      throw err;
    }
  }, []);

  const loginWithFace = useCallback(async (faceData: any, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: `face-user${Math.random().toString(36).substr(2, 5)}@school.com`,
        name: 'Face User',
        role,
        faceId: 'face_' + Math.random().toString(36).substr(2, 9),
        lastLogin: new Date(),
        isBiometricEnabled: true,
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Face recognition failed. Please try again.',
      }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (userData: any, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        role,
        phone: userData.phone,
        lastLogin: new Date(),
        isBiometricEnabled: false,
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Signup failed. Please try again.',
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('authUser');
  }, []);

  const updateBiometric = useCallback(async (enabled: boolean) => {
    if (authState.user) {
      const updatedUser: AuthUser = {
        ...authState.user,
        isBiometricEnabled: enabled,
      };
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  }, [authState.user]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } catch (err) {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithOTP,
    loginWithFace,
    signup,
    logout,
    updateBiometric,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
