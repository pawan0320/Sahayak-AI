'use client';

import {useState, useRef, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { faceDetectionService, FaceData } from '@/lib/faceDetectionService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function TeacherSignup() {
  const router = useRouter();
  const { teacherSignup } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    subject: '',
    assignedClasses: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'face'>('form');
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Face capture refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize face detection on mount
  useEffect(() => {
    const init = async () => {
      try {
        await faceDetectionService.initialize();
      } catch (error) {
        console.warn('Face detection initialization warning:', error);
      }
    };
    init();
  }, [])

  // Start camera for face capture
  const startCamera = async () => {
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

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture face
  const captureFace = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!videoRef.current) {
        setError('Camera not initialized');
        return;
      }

      const data = await faceDetectionService.captureFaceImage(videoRef.current);
      setFaceData(data);
      setSuccess('Face captured successfully! ✓');
      stopCamera();
    } catch (error: any) {
      setError(error.message || 'Face capture failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle class selection
  const toggleClass = (classValue: string) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(classValue)
        ? prev.assignedClasses.filter(c => c !== classValue)
        : [...prev.assignedClasses, classValue],
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    setError('');

    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }

    if (formData.phone.length < 10) {
      setError('Valid phone number is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.schoolName.trim()) {
      setError('School name is required');
      return false;
    }

    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }

    if (formData.assignedClasses.length === 0) {
      setError('Select at least one class');
      return false;
    }

    if (!faceData) {
      setError('Face scan is mandatory');
      return false;
    }

    return true;
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      setError('');

      await teacherSignup({
        ...formData,
        faceData: faceData?.base64,
      });

      setSuccess('Account created successfully! ✓');
      setTimeout(() => router.push('/teacher/dashboard'), 1500);
    } catch (error: any) {
      setError(error.message || 'Signup failed');
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
                Teacher Registration
              </h1>
              <p className='text-slate-400 mt-2'>Create your SAHAYAK teacher account</p>
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

            <form onSubmit={handleSignup} className='space-y-6'>
              {/* Basic Information */}
              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='space-y-4'
                >
                  <div className='grid md:grid-cols-2 gap-4'>
                    <Input
                      type='text'
                      name='name'
                      placeholder='Full Name'
                      value={formData.name}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                    <Input
                      type='email'
                      name='email'
                      placeholder='Email'
                      value={formData.email}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <Input
                      type='tel'
                      name='phone'
                      placeholder='Phone Number'
                      value={formData.phone}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                    <Input
                      type='text'
                      name='schoolName'
                      placeholder='School Name'
                      value={formData.schoolName}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <Input
                      type='text'
                      name='subject'
                      placeholder='Subject (e.g., Mathematics)'
                      value={formData.subject}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                  </div>

                  {/* Password Fields */}
                  <div className='space-y-2'>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder='Password (6+ characters)'
                        value={formData.password}
                        onChange={handleChange}
                        className='bg-slate-800 border-slate-700 text-white placeholder-slate-500 pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200'
                      >
                        {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                      </button>
                    </div>

                    <Input
                      type='password'
                      name='confirmPassword'
                      placeholder='Confirm Password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    />
                  </div>

                  {/* Class Selection */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>Assigned Classes</label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map(c => (
                        <button
                          key={c}
                          type='button'
                          onClick={() => toggleClass(c)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            formData.assignedClasses.includes(c)
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type='button'
                    onClick={() => {
                      if (formData.name && formData.email && formData.phone) {
                        setStep('face');
                        startCamera();
                      } else {
                        setError('Please fill in all required fields first');
                      }
                    }}
                    className='w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white'
                  >
                    Next: Face Scan
                  </Button>
                </motion.div>
              )}

              {/* Face Capture */}
              {step === 'face' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='space-y-4'
                >
                  <div className='bg-slate-800 rounded-2xl p-6 border border-purple-500/20'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold text-white mb-2 flex items-center gap-2'>
                        <Camera className='w-5 h-5 text-purple-400' />
                        Face Verification (Mandatory)
                      </h3>
                      <p className='text-slate-400 text-sm'>
                        Your face will be used for secure login. Position your face clearly in the camera.
                      </p>
                    </div>

                    {!faceData && streamRef.current && (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className='w-full rounded-xl bg-black aspect-video object-cover'
                      />
                    )}

                    {faceData && (
                      <div className='relative'>
                        <img
                          src={faceData.base64}
                          alt='Face Capture'
                          className='w-full rounded-xl'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl'>
                          <CheckCircle className='w-16 h-16 text-green-400' />
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className='hidden' />
                  </div>

                  {!faceData && (
                    <div className='flex gap-3'>
                      <Button
                        type='button'
                        onClick={captureFace}
                        disabled={isLoading || !streamRef.current}
                        className='flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                      >
                        {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                        {isLoading ? 'Scanning...' : 'Capture Face'}
                      </Button>
                      <Button
                        type='button'
                        onClick={() => {
                          stopCamera();
                          setStep('form');
                        }}
                        variant='outline'
                        className='flex-1 border-slate-600 hover:bg-slate-800'
                      >
                        Back
                      </Button>
                    </div>
                  )}

                  {faceData && (
                    <div className='flex gap-3'>
                      <Button
                        type='submit'
                        disabled={isLoading}
                        className='flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                      >
                        {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                      <Button
                        type='button'
                        onClick={() => {
                          setFaceData(null);
                          startCamera();
                        }}
                        variant='outline'
                        className='flex-1 border-slate-600 hover:bg-slate-800'
                      >
                        Retake
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </form>

            {/* Login Link */}
            <div className='mt-6 text-center text-slate-400 text-sm'>
              Already have an account?{' '}
              <Link href='/auth/teacher/login' className='text-purple-400 hover:text-purple-300 font-medium'>
                Login here
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
