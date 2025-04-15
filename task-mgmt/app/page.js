'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/authContext.js';

export default function Home() {
  const { user, register } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // opóźnienie renderowania komponentu, by dane były dostępne
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  async function onSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;
    try {
      await register(email, username, password);
      router.push('/tasks');
    } catch (error) {
      alert("registration failed, check that your details are correct or make sure you don't already have an account");
    }
  }

  if (!isMounted) {
    return null; // jeśli nie jest zamontowany, nie renderuj nic
  }

  return (
    <div className="container main">
      <div className="border_custom logo">
        <span>QUESTIFY</span>
      </div>
      <div className="main_wrapper border_custom d-flex align-items-center mx-auto">
        <form className="login_form_wrapper mx-auto" onSubmit={onSubmit}>
          <div className="input_wrapper d-flex align-items-center">
            <Image src="/img/account.svg" width={64} height={64} alt='account' />
            <input type="text" name="username" id="username" className="border_custom login_form" placeholder="username" />
          </div>
          <div className="input_wrapper d-flex align-items-center my-4">
            <Image src="/img/email.svg" width={64} height={64} alt='email' />
            <input type="email" name="email" id="email" className="border_custom login_form" placeholder="email" />
          </div>
          <div className="input_wrapper d-flex align-items-center">
            <Image src="/img/password.svg" width={64} height={64} alt='password' />
            <input type="password" name="password" id="password" className="border_custom login_form" placeholder="password" />
          </div>
          <div className="input_wrapper text-center mt-4">
            <input type="submit" value="register" className="border_custom button_style" />
          </div>
        </form>
      </div>
    </div>
  );
}
