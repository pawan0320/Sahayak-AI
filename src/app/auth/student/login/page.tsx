'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentLogin() {
  const router = useRouter();
  const { studentLogin } = useAuth();

  const [formData, setFormData] = useState({
    rollNo: '',
    schoolCode: '',
    pin: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pin' ? value.replace(/\D/g, '').slice(0, 4) : value,
    }));
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.rollNo.trim()) {
      setError('Roll number is required');
      return false;
    }

    if (!formData.schoolCode.trim()) {
      setError('School code is required');
      return false;
    }

    if (!formData.pin || formData.pin.length !== 4) {
      setError('PIN must be 4 digits');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      setError('');

      await studentLogin(formData.rollNo, formData.schoolCode, formData.pin);

      setSuccess('Login successful! ✓');
      setTimeout(() => router.push('/student/dashboard'), 1500);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='border-blue-500/20 bg-blue-900/80 backdrop-blur-xl shadow-2xl'>
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                Student Login
              </h1>
              <p className='text-blue-300 mt-2'>Welcome to SAHAYAK</p>
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

            <form onSubmit={handleLogin} className='space-y-4'>
              {/* Roll Number */}
              <div>
                <label className='text-sm text-blue-300 mb-2 block'>Roll Number</label>
                <Input
                  type='text'
                  name='rollNo'
                  placeholder='Enter your roll number'
                  value={formData.rollNo}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
              </div>

              {/* School Code */}
              <div>
                <label className='text-sm text-blue-300 mb-2 block'>School Code</label>
                <Input
                  type='text'
                  name='schoolCode'
                  placeholder='Enter school code'
                  value={formData.schoolCode}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
              </div>

              {/* PIN Entry */}
              <div>
                <label className='text-sm text-blue-300 mb-2 block'>Login PIN</label>
                <div className='flex gap-2'>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type='password'
                      maxLength={1}
                      value={formData.pin[i] || ''}
                      onChange={(e) => {
                        const newPin = formData.pin.split('');
                        newPin[i] = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, pin: newPin.join('') });
                        
                        // Auto-focus next field
                        if (newPin[i] && i < 3) {
                          const nextInput = (e.target.parentElement?.children[i + 1] as HTMLInputElement);
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !formData.pin[i] && i > 0) {
                          const prevInput = ((e.target as HTMLInputElement).parentElement?.children[i - 1] as HTMLInputElement);
                          prevInput?.focus();
                        }
                      }}
                      className='flex-1 w-12 h-12 text-center bg-blue-800 border border-blue-700 text-white text-xl font-bold rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50'
                    />
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white mt-6'
              >
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Info Box */}
            <div className='mt-6 p-4 bg-blue-800/50 border border-blue-700/50 rounded-lg'>
              <p className='text-xs text-blue-300'>
                💡 <strong>Demo Credentials:</strong><br/>
                Roll No: 001<br/>
                School Code: SCHOOL001<br/>
                PIN: 1234
              </p>
            </div>

            {/* Signup Link */}
            <div className='mt-6 text-center text-blue-300 text-sm'>
              New student?{' '}
              <Link href='/auth/student/signup' className='text-cyan-400 hover:text-cyan-300 font-medium'>
                Register here
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

