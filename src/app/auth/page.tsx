'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Eye, EyeOff, Lock, Mail, Hash, User, Camera, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { CameraUI } from '@/components/auth/CameraUI';
import { OTPInput } from '@/components/auth/OTPInput';

export default function UnifiedAuthPage() {
  const [activeRole, setActiveRole] = useState<'teacher' | 'student' | 'admin'>('teacher');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'face'>('form');
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp' | 'face'>('email');
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const { login, signup, loginWithOTP, loginWithFace, isLoading, error } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    rollNumber: '',
    className: '',
    faceData: '',
    otp: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Teacher Login Handler
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email') {
      await login(formData.email, formData.password, 'teacher');
      router.push('/dashboard');
    } else if (loginMethod === 'otp') {
      if (formData.otp.length === 6) {
        await loginWithOTP(formData.phone, formData.otp, 'teacher');
        router.push('/dashboard');
      }
    } else if (loginMethod === 'face') {
      setStep('face');
    }
  };

  // Teacher Signup Handler
  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) return;
    setStep('face');
  };

  const handleTeacherFaceCapture = async (imageData: string) => {
    setFormData((prev) => ({ ...prev, faceData: imageData }));
    await signup({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      faceData: imageData,
    }, 'teacher');
    router.push('/dashboard');
  };

  // Student Login Handler
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    await login(formData.email, formData.password, 'student');
    router.push('/student/dashboard');
  };

  // Student Signup Handler
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.rollNumber || !formData.className) return;
    setStep('face');
  };

  const handleStudentFaceCapture = async (imageData: string) => {
    await signup({
      name: formData.fullName,
      rollNumber: formData.rollNumber,
      className: formData.className,
      password: formData.password,
      faceData: imageData,
    }, 'student');
    router.push('/student/dashboard');
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'face') {
      setStep('face');
    } else {
      await login(formData.email, formData.password, 'admin');
      router.push('/admin/dashboard');
    }
  };

  const handleAdminFaceCapture = async (imageData: string) => {
    await loginWithFace(imageData, 'admin');
    router.push('/admin/dashboard');
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
              <p className="text-xs text-muted-foreground">AI Powered Education</p>
            </div>
          </motion.div>

          {/* Role Selection Tabs */}
          <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {/* TEACHER AUTH */}
            <TabsContent value="teacher" className="space-y-4">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setStep('form'); }}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>

                {/* Teacher Login */}
                <TabsContent value="login">
                  {step === 'form' ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-center">Teacher Login</h2>
                      <p className="text-sm text-muted-foreground text-center mb-6">
                        Choose your preferred login method
                      </p>

                      {error && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                          {error}
                        </div>
                      )}

                      {/* Login Method Tabs */}
                      <div className="flex gap-2 mb-6">
                        <Button
                          variant={loginMethod === 'email' ? 'default' : 'outline'}
                          onClick={() => setLoginMethod('email')}
                          className="flex-1"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          variant={loginMethod === 'otp' ? 'default' : 'outline'}
                          onClick={() => setLoginMethod('otp')}
                          className="flex-1"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          OTP
                        </Button>
                        <Button
                          variant={loginMethod === 'face' ? 'default' : 'outline'}
                          onClick={() => setLoginMethod('face')}
                          className="flex-1"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Face
                        </Button>
                      </div>

                      <form onSubmit={handleTeacherLogin} className="space-y-4">
                        {/* Email */}
                        {(loginMethod === 'email' || loginMethod === 'otp') && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your@email.com"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Password or OTP */}
                        {loginMethod === 'email' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Password</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                        )}

                        {loginMethod === 'otp' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">OTP Code</label>
                            <OTPInput
                              onComplete={(otp) => handleInputChange('otp', otp)}
                            />
                          </div>
                        )}

                        {loginMethod === 'face' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Face Verification</label>
                            <div className="p-4 rounded-lg border border-border/50 text-center">
                              <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Click login to start face verification</p>
                            </div>
                          </div>
                        )}

                        <Button type="submit" disabled={isLoading} className="w-full">
                          {isLoading ? 'Processing...' : 'Login'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-center">Face Verification</h2>
                      <CameraUI
                        onCapture={handleTeacherFaceCapture}
                        onFaceDetected={setIsFaceDetected}
                        isLoading={isLoading}
                      />
                      <Button variant="outline" onClick={() => setStep('form')} className="w-full mt-4">
                        Back
                      </Button>
                    </>
                  )}
                </TabsContent>

                {/* Teacher Signup */}
                <TabsContent value="signup">
                  {step === 'form' ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-center">Create Teacher Account</h2>
                      <form onSubmit={handleTeacherSignup} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              placeholder="Your full name"
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your@email.com"
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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

                        <Button type="submit" disabled={isLoading} className="w-full">
                          {isLoading ? 'Processing...' : 'Proceed to Face Registration'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-center">Register Your Face</h2>
                      <CameraUI
                        onCapture={handleTeacherFaceCapture}
                        onFaceDetected={setIsFaceDetected}
                        isLoading={isLoading}
                      />
                      <Button variant="outline" onClick={() => setStep('form')} className="w-full mt-4">
                        Back
                      </Button>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* STUDENT AUTH */}
            <TabsContent value="student" className="space-y-4">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setStep('form'); }}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>

                {/* Student Login */}
                <TabsContent value="login">
                  <h2 className="text-2xl font-bold mb-2 text-center">Student Login</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">Sign in with your roll number</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Roll Number</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.rollNumber}
                          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                          placeholder="Your roll number"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Processing...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Student Signup */}
                <TabsContent value="signup">
                  {step === 'form' ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-center">Create Student Account</h2>
                      <form onSubmit={handleStudentSignup} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              placeholder="Your full name"
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Roll Number</label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={formData.rollNumber}
                              onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                              placeholder="Your roll number"
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Class</label>
                          <select
                            value={formData.className}
                            onChange={(e) => handleInputChange('className', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                          >
                            <option value="">Select your class</option>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                              <option key={cls} value={`Class ${cls}`}>Class {cls}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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

                        <Button type="submit" disabled={isLoading} className="w-full">
                          {isLoading ? 'Processing...' : 'Proceed to Face Registration'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-center">Register Your Face</h2>
                      <CameraUI
                        onCapture={handleStudentFaceCapture}
                        onFaceDetected={setIsFaceDetected}
                        isLoading={isLoading}
                      />
                      <Button variant="outline" onClick={() => setStep('form')} className="w-full mt-4">
                        Back
                      </Button>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* ADMIN AUTH */}
            <TabsContent value="admin" className="space-y-4">
              {step === 'form' ? (
                <>
                  <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">Secure administration access</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2 mb-6">
                    <Button
                      variant={loginMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setLoginMethod('email')}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant={loginMethod === 'face' ? 'default' : 'outline'}
                      onClick={() => setLoginMethod('face')}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Face
                    </Button>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="admin@school.com"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                      </div>
                    </div>

                    {loginMethod === 'email' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    )}

                    {loginMethod === 'face' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Face Verification</label>
                        <div className="p-4 rounded-lg border border-border/50 text-center">
                          <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click login to start face verification</p>
                        </div>
                      </div>
                    )}

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Processing...' : 'Login'}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">Face Verification</h2>
                  <CameraUI
                    onCapture={handleAdminFaceCapture}
                    onFaceDetected={setIsFaceDetected}
                    isLoading={isLoading}
                  />
                  <Button variant="outline" onClick={() => setStep('form')} className="w-full mt-4">
                    Back
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
