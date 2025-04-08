'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogin } from '../contexts/loginContext.js'

export default function TasksPage() {
  const { loggedIn } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push('/');
    }
  }, [loggedIn, router]);

  return (
    <div>
      <h1>Tasks</h1>
    </div>
  );
}