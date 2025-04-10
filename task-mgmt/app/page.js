'use client';

// import Image from "next/image";
// import styles from "./page.module.css";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from './contexts/loginContext.js';

export default function Home() {
  const { loggedIn, setLoggedIn } = useLogin();
  const router = useRouter();
  
  useEffect(() => {
    if (loggedIn) {
      router.push('/tasks');
    }
  }, [loggedIn, router]);
  
  async function onSubmit(e) {
    e.preventDefault()
    setLoggedIn(true)
    router.push('/tasks');
  }

  return (
    <div className="container main">
      <div className="border_custom logo">
        <span>QUESTIFY</span>
      </div>
      <div className="main_wrapper border_custom d-flex align-items-center mx-auto">
        <form className="login_form_wrapper mx-auto" onSubmit={onSubmit}>
        <div className="input_wrapper d-flex align-items-center">
          <input type="text" name="username" id="username" className="border_custom login_form" placeholder="username" />
        </div>
        <div className="input_wrapper d-flex align-items-center my-4">
          <input type="email" name="email" id="email" className="border_custom login_form" placeholder="email" />
        </div>
        <div className="input_wrapper d-flex align-items-center">
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
