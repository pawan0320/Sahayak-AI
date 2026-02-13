import { redirect } from 'next/navigation';

export default function ProfilePage() {
  // This page requires authentication - redirect to auth
  redirect('/auth/teacher/login');
}
