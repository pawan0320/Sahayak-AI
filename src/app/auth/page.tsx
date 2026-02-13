'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to teacher login by default
    router.push('/auth/teacher/login');
  }, [router]);
  return null;
}