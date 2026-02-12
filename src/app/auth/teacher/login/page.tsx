'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Eye, EyeOff, Mail, Lock, Phone, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { CameraUI } from '@/components/auth/CameraUI';
import { OTPInput } from '@/components/auth/OTPInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TeacherLogin() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp' | 'face'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  
  const { login, loginWithOTP, loginWithFace, isLoading, error } = useAuth();
  const router = useRouter();

  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
  });

  const [otpForm, setOtpForm] = useState({
    phone: '',
    otp: '',
    otpSent: false,
  });

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(emailForm.email, emailForm.password, 'teacher');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // OTP Login
  const handleSendOTP = async () => {
    if (!otpForm.phone) return;
    setOtpForm((prev) => ({ ...prev, otpSent: true }));
  };

  const handleOTPComplete = async (otp: string) => {
    try {
      await loginWithOTP(otpForm.phone, otp, 'teacher');
      router.push('/dashboard');
    } catch (err) {
      console.error('OTP login error:', err);
    }
  };

  // Face Login
  const handleFaceCapture = async (imageData: string) => {
    try {
      await loginWithFace(imageData, 'teacher');
      router.push('/dashboard');
    } catch (err) {
      console.error('Face login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 border-border/50 shadow-lg shadow-primary/10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg">
              <Bot className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahayak
              </h1>
              <p className="text-xs text-muted-foreground">Teacher Portal</p>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-2">Teacher Login</h2>
            <p className="text-sm text-muted-foreground">Choose your preferred login method</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
                <TabsTrigger value="face">Face Login</TabsTrigger>
              </TabsList>

              {/* Email/Password Login */}
              <TabsContent value="email" className="space-y-4 mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                        placeholder="your.email@school.com"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Password</label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={emailForm.password}
                        onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login */}
              <TabsContent value="otp" className="space-y-4 mt-6">
                {!otpForm.otpSent ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          value={otpForm.phone}
                          onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading || !otpForm.phone}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                      Enter the 6-digit OTP sent to {otpForm.phone}
                    </p>
                    <OTPInput onComplete={handleOTPComplete} />
                    <Button
                      variant="outline"
                      onClick={() => setOtpForm({ ...otpForm, otpSent: false })}
                      className="w-full"
                    >
                      Change Phone Number
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Face Login */}
              <TabsContent value="face" className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Position your face in the frame for biometric authentication
                  </p>
                </div>

                <CameraUI
                  onCapture={handleFaceCapture}
                  onFaceDetected={setIsFaceDetected}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Signup Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/teacher/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
