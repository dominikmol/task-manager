'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../contexts/loginContext.js';

export default function AccountPage() {
  const { loggedIn } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push('/');
    }
  }, [loggedIn, router]);

    return (
      <div>
        {loggedIn ? (
          <h1>Account Page</h1>
        ): (
          <h1>Error 418 I&apos;m a teapot</h1>
        )}
      </div>
    );
  }