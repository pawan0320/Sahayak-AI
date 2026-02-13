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

export default function StudentSignup() {
  const router = useRouter();
  const { studentSignup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    class: '',
    section: '',
    schoolCode: '',
    parentPhone: '',
    pin: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.name.trim()) {
      setError('Student name is required');
      return false;
    }

    if (!formData.rollNo.trim()) {
      setError('Roll number is required');
      return false;
    }

    if (!formData.class) {
      setError('Class selection is required');
      return false;
    }

    if (!formData.section.trim()) {
      setError('Section is required');
      return false;
    }

    if (!formData.schoolCode.trim()) {
      setError('School code is required');
      return false;
    }

    if (formData.parentPhone.length < 10) {
      setError('Valid parent phone is required');
      return false;
    }

    if (!formData.pin || formData.pin.length !== 4 || !/^\d+$/.test(formData.pin)) {
      setError('PIN must be 4 digits');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      setError('');

      await studentSignup(formData);

      setSuccess('Signup successful! ✓');
      setTimeout(() => router.push('/auth/student/login'), 1500);
    } catch (error: any) {
      setError(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];


  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-2xl'
      >
        <Card className='border-blue-500/20 bg-blue-900/80 backdrop-blur-xl shadow-2xl'>
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                Student Registration
              </h1>
              <p className='text-blue-300 mt-2'>Join SAHAYAK and start learning</p>
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

            <form onSubmit={handleSignup} className='space-y-4'>
              {/* Personal Information */}
              <div className='grid md:grid-cols-2 gap-4'>
                <Input
                  type='text'
                  name='name'
                  placeholder='Full Name'
                  value={formData.name}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
                <Input
                  type='text'
                  name='rollNo'
                  placeholder='Roll Number'
                  value={formData.rollNo}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
              </div>

              {/* Class & Section */}
              <div className='grid md:grid-cols-2 gap-4'>
                <select
                  name='class'
                  value={formData.class}
                  onChange={handleChange}
                  className='bg-blue-800 border border-blue-700 text-white rounded-lg px-3 py-2'
                >
                  <option value=''>Select Class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <Input
                  type='text'
                  name='section'
                  placeholder='Section (e.g., A, B)'
                  value={formData.section}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
              </div>

              {/* School Code & Parent Phone */}
              <div className='grid md:grid-cols-2 gap-4'>
                <Input
                  type='text'
                  name='schoolCode'
                  placeholder='School Code'
                  value={formData.schoolCode}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
                <Input
                  type='tel'
                  name='parentPhone'
                  placeholder='Parent Phone'
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400'
                />
              </div>

              {/* 4-Digit PIN */}
              <div>
                <label className='text-sm text-blue-300 mb-2 block'>Login PIN (4 digits)</label>
                <Input
                  type='password'
                  name='pin'
                  placeholder='Enter 4-digit PIN'
                  maxLength={4}
                  value={formData.pin}
                  onChange={handleChange}
                  className='bg-blue-800 border-blue-700 text-white placeholder-blue-400 text-center text-2xl tracking-widest'
                />
              </div>

              {/* Submit */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white mt-6'
              >
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className='mt-6 text-center text-blue-300 text-sm'>
              Already registered?{' '}
              <Link href='/auth/student/login' className='text-cyan-400 hover:text-cyan-300 font-medium'>
                Login here
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
