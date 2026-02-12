'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock,  Shield, Camera, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { CameraUI } from '@/components/auth/CameraUI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'face'>('password');
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  
  const { login, loginWithFace, isLoading, error } = useAuth();
  const router = useRouter();

  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
  });

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(emailForm.email, emailForm.password, 'admin');
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Face Login
  const handleFaceCapture = async (imageData: string) => {
    try {
      await loginWithFace(imageData, 'admin');
      router.push('/admin/dashboard');
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
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg relative">
              <Shield className="w-8 h-8 text-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahayak
              </h1>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
            <p className="text-sm text-muted-foreground">Secure login with biometric verification</p>
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Email & Password</TabsTrigger>
                <TabsTrigger value="face">Face Verification</TabsTrigger>
              </TabsList>

              {/* Email/Password Login */}
              <TabsContent value="password" className="space-y-4 mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                        placeholder="admin@sahayak.com"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
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
                    {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
                  </Button>
                </form>
              </TabsContent>

              {/* Face Verification Login */}
              <TabsContent value="face" className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Register and verify your face for secure admin access
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

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm"
          >
            <p className="text-muted-foreground">
              ✓ Two-factor authentication enabled for all admin accounts
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
