'use client';

import { useAuth, UserRole } from '@/components/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login based on attempted route
      if (pathname.startsWith('/teacher')) {
        router.push('/auth/teacher/login');
      } else if (pathname.startsWith('/student')) {
        router.push('/auth/student/login');
      } else if (pathname.startsWith('/admin')) {
        router.push('/auth/admin/login');
      } else {
        router.push('/');
      }
      return;
    }

    // Check if user role is allowed
    if (userRole && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard
      if (userRole === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (userRole === 'student') {
        router.push('/student/dashboard');
      } else if (userRole === 'admin') {
        router.push('/admin/dashboard');
      }
      return;
    }
  }, [isLoading, isAuthenticated, userRole, router, pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-accent/5'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
