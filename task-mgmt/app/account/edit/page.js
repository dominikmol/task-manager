'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, logout } from '@/app/contexts/authContext.js';
import Image from 'next/image';
import pb from '@/app/services/pocketbase';

export default function AccountEditPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // opóźnienie renderowania komponentu, by dane były dostępne
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      pb.collection('users').getOne(user.id)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, [user, userData]);

  if (!isMounted) {
    return null; // jeśli komponent nie jest zamontowany, nie renderuj nic
  }

  function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const email = e.target.email.value;
    console.log('username', username);
    console.log('password', password);
    console.log('email', email);
    if (!password) {
      const userid = user.id;
      logout();
      console.log("haslo puste");
      pb.collection('users').update(userid, {
        email: email,
        name: username,
      })
        .then(() => {
          router.push('/account');
        })
        .catch((error) => {
          console.log('Error updating user:', error);
        });
    } else {
      const userid = user.id;
      logout();
      console.log("haslo nowe");
      pb.collection('users').update(userid, {
        email: email,
        name: username,
        password: password,
      })
        .then(() => {
          console.log("haslo zmienione na " + password);
          router.push('/account');
        })
        .catch((error) => {
          console.log('Error updating user:', error);
        });
    }
  }

  return (
    <>
      {user ? (
        <div className="container d-flex flex-grow-1 main">
          <div className="user_page my-auto main_wrapper d-flex flex-column align-items-center mx-auto border_custom">
            <form onSubmit={handleSubmit} className="login_form_wrapper mx-auto">
              <div className="input_wrapper d-flex align-items-center my-4">
              </div>
              <div className="input_wrapper d-flex align-items-center my-4">
                <Image src="/img/email.svg" width={64} height={64} alt='email' className="me-3" />
                <input type="text" name="username" id="username" className="border_custom login_form" placeholder="username" defaultValue={userData.name} />
              </div>
              <div className="input_wrapper d-flex align-items-center my-4">
                <Image src="/img/account.svg" width={64} height={64} alt='account' className="me-3" />
                <input type="text" name="email" id="email" className="border_custom login_form" placeholder="email" defaultValue={userData.email} />
              </div>
              <div className="input_wrapper d-flex align-items-center">
                <Image src="/img/password.svg" width={64} height={64} alt='password' className="me-3" />
                <input type="password" name="password" id="password" className="border_custom login_form" placeholder="password" />
              </div>
              <div className="input_wrapper d-flex justify-content-center gap-2 mt-5">
                <button className="border_custom button_style" type="reset">
                  <Image src="/img/cancel.svg" width={32} height={32} alt='cancel' />
                  cancel
                </button>
                <button className="border_custom button_style" type="submit">
                  <Image src="/img/save.svg" width={32} height={32} alt='save' />
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <h1>Error 418 I&apos;m a teapot</h1>
      )
      }
    </>
  );
}