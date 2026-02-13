'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { faceDetectionService } from '@/lib/faceDetectionService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, Camera, AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeacherLogin() {
  const router = useRouter();
  const { teacherLogin, teacherLoginWithFace } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'otp' | 'face'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email login state
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
  });

  // OTP login state
  const [otpForm, setOtpForm] = useState({
    phone: '',
    otp: '',
    otpSent: false,
  });

  // Face login state
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [faceUid, setFaceUid] = useState('');

  // Initialize face detection
  useEffect(() => {
    const init = async () => {
      try {
        await faceDetectionService.initialize();
      } catch (error) {
        console.warn('Face detection init:', error);
      }
    };
    init();
  }, []);

  // Start face camera
  const startFaceCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error: any) {
      setError(`Camera error: ${error.message}`);
    }
  };

  // Stop face camera
  const stopFaceCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!emailForm.email.includes('@')) {
        setError('Valid email is required');
        return;
      }

      if (emailForm.password.length < 6) {
        setError('Invalid credentials');
        return;
      }

      const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);

      await teacherLogin(emailForm.email, emailForm.password);
      setSuccess('Login successful! ✓');
      setTimeout(() => router.push('/teacher/dashboard'), 1500);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP request
  const handleSendOTP = async () => {
    setError('');

    if (otpForm.phone.length < 10) {
      setError('Valid phone number is required');
      return;
    }

    // Mock OTP send
    setOtpForm(prev => ({ ...prev, otpSent: true }));
    setSuccess('OTP sent to your phone! ✓');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle OTP login
  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (otpForm.otp.length !== 6 || !/^\d+$/.test(otpForm.otp)) {
        setError('Valid 6-digit OTP is required');
        return;
      }

      // Mock OTP verification (in production, verify with backend)
      if (otpForm.otp === '123456') {
        // Mock teacher login with OTP
        const mockTeacher = await teacherLogin('teacher@demo.com', 'password123');
        setSuccess('Login successful! ✓');
        setTimeout(() => router.push('/teacher/dashboard'), 1500);
      } else {
        setError('Invalid OTP');
      }
    } catch (error: any) {
      setError(error.message || 'OTP login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle face login
  const handleFaceVerify = async () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setError('');

    try {
      const detection = await faceDetectionService.detectFaceFromVideo(videoRef.current);

      if (!detection.detected) {
        setError('No face detected. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsFaceDetected(true);
      setSuccess('Face verified! Logging in...');

      // In production, send face data to backend for matching
      // For demo, use mock UID
      const mockUid = 'teacher-' + Math.random().toString(36).substr(2, 9);
      setFaceUid(mockUid);

      setTimeout(() => {
        // stopFaceCamera();
        // Simulate login with face
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'Face verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-2xl'
      >
        <Card className='border-purple-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl'>
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Teacher Login
              </h1>
              <p className='text-slate-400 mt-2'>Choose your login method</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mb-4'
              >
                <Alert className='border-red-500/50 bg-red-500/10'>
                  <AlertCircle className='w-4 h-4 text-red-500' />
                  <AlertDescription className='text-red-400'>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mb-4'
              >
                <Alert className='border-green-500/50 bg-green-500/10'>
                  <CheckCircle className='w-4 h-4 text-green-500' />
                  <AlertDescription className='text-green-400'>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className='w-full'>
              <TabsList className='grid w-full grid-cols-3 bg-slate-800 border border-slate-700'>
                <TabsTrigger value='email' className='text-slate-300'>Email</TabsTrigger>
                <TabsTrigger value='otp' className='text-slate-300'>OTP</TabsTrigger>
                <TabsTrigger value='face' className='text-slate-300'>Face</TabsTrigger>
              </TabsList>

              {/* Email Login Tab */}
              <TabsContent value='email' className='space-y-4 mt-6'>
                <form onSubmit={handleEmailLogin} className='space-y-4'>
                  <div>
                    <Input
                      type='email'
                      placeholder='Email Address'
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                  </div>

                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500 pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                    >
                      {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>

                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                  >
                    {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                    {isLoading ? 'Logging in...' : 'Login with Email'}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login Tab */}
              <TabsContent value='otp' className='space-y-4 mt-6'>
                {!otpForm.otpSent ? (
                  <div className='space-y-4'>
                    <Input
                      type='tel'
                      placeholder='Phone Number (+91...)'
                      value={otpForm.phone}
                      onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />

                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className='w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleOTPLogin} className='space-y-4'>
                    <p className='text-sm text-slate-300 text-center'>
                      Enter 6-digit OTP sent to {otpForm.phone}
                    </p>

                    <div className='flex gap-2'>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          type='text'
                          maxLength={1}
                          value={otpForm.otp[i] || ''}
                          onChange={(e) => {
                            const newOtp = otpForm.otp.split('');
                            newOtp[i] = e.target.value.replace(/\D/g, '');
                            setOtpForm({ ...otpForm, otp: newOtp.join('') });
                          }}
                          className='w-10 h-10 text-center bg-slate-800 border border-slate-700 text-white rounded-lg'
                        />
                      ))}
                    </div>

                    <Button
                      type='submit'
                      disabled={isLoading || otpForm.otp.length !== 6}
                      className='w-full bg-gradient-to-r from-purple-600 to-purple-500'
                    >
                      {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>

                    <Button
                      type='button'
                      onClick={() => setOtpForm({ phone: '', otp: '', otpSent: false })}
                      variant='outline'
                      className='w-full border-slate-600 text-slate-300'
                    >
                      Change Number
                    </Button>
                  </form>
                )}
              </TabsContent>

              {/* Face Login Tab */}
              <TabsContent value='face' className='space-y-4 mt-6'>
                <div className='bg-slate-800 rounded-2xl p-6 border border-purple-500/20'>
                  <h3 className='text-lg font-semibold text-white mb-2 flex items-center gap-2'>
                    <Camera className='w-5 h-5 text-purple-400' />
                    Face Verification
                  </h3>
                  <p className='text-slate-400 text-sm mb-4'>
                    Position your face in the camera to login
                  </p>

                  {!isFaceDetected && streamRef.current && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className='w-full rounded-xl bg-black aspect-video object-cover'
                    />
                  )}

                  {isFaceDetected && (
                    <div className='relative'>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className='w-full rounded-xl bg-black aspect-video object-cover'
                      />
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl'>
                        <CheckCircle className='w-16 h-16 text-green-400' />
                      </div>
                    </div>
                  )}
                </div>

                {!isFaceDetected ? (
                  <div className='flex gap-3'>
                    <Button
                      onClick={streamRef.current ? handleFaceVerify : startFaceCamera}
                      disabled={isLoading}
                      className='flex-1 bg-gradient-to-r from-green-600 to-green-500'
                    >
                      {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                      {streamRef.current ? (isLoading ? 'Scanning...' : 'Verify Face') : 'Start Camera'}
                    </Button>
                  </div>
                ) : (
                  <div className='flex gap-3'>
                    <Button
                      onClick={() => { stopFaceCamera(); setIsFaceDetected(false); }}
                      variant='outline'
                      className='flex-1 border-slate-600 text-slate-300'
                    >
                      Retaken
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Signup Link */}
            <div className='mt-8 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm'>
              Don't have an account?{' '}
              <Link href='/auth/teacher/signup' className='text-purple-400 hover:text-purple-300 font-medium'>
                Sign up here
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
