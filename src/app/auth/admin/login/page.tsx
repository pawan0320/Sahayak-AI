'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Valid password is required');
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

      await adminLogin(formData.email, formData.password);

      setSuccess('Login successful! ✓');
      setTimeout(() => router.push('/admin/dashboard'), 1500);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-950 via-orange-950 to-red-950 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='border-red-500/20 bg-red-950/80 backdrop-blur-xl shadow-2xl'>
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='inline-block mb-4 p-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg'>
                <Shield className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent'>
                Admin Portal
              </h1>
              <p className='text-red-300 mt-2'>Secure Access Required</p>
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
              {/* Email */}
              <div>
                <label className='text-sm text-red-300 mb-2 block'>Admin Email</label>
                <Input
                  type='email'
                  name='email'
                  placeholder='admin@sahayak.com'
                  value={formData.email}
                  onChange={handleChange}
                  className='bg-red-900 border-red-700 text-white placeholder-red-400'
                />
              </div>

              {/* Password */}
              <div>
                <label className='text-sm text-red-300 mb-2 block'>Password</label>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    className='bg-red-900 border-red-700 text-white placeholder-red-400 pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-red-400'
                  >
                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white mt-6'
              >
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>

            {/* Security Info */}
            <div className='mt-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg'>
              <p className='text-xs text-red-300'>
                🔐 <strong>Demo Credentials:</strong><br/>
                Email: admin@sahayak.com<br/>
                Password: admin123
              </p>
            </div>

            {/* Footer */}
            <div className='mt-6 text-center text-red-300 text-sm'>
              Not authorized? Contact system administrator
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
