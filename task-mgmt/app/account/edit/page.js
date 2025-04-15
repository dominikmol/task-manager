'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import Image from 'next/image';
import pb from '@/app/services/pocketbase';

export default function AccountEditPage() {
  const { user, logout } = useAuth();
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
  }, [user]);

  if (!isMounted) {
    return null; // jeśli komponent nie jest zamontowany, nie renderuj nic
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.password.value;
    const userid = user.id;
    console.log('User ID:', userid);

    try {
      const updatedData = {
        name: username,
      };

      if (newPassword !== '') {
        updatedData.oldPassword = oldPassword;
        updatedData.password = newPassword;
        updatedData.passwordConfirm = newPassword;
      }

      await pb.collection('users').update(userid, updatedData);

      alert("you will be logged out, please log in again to see the changes");
      logout();
      router.push('/');

    } catch (error) {
      console.error('Error updating user data:', error);
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
                <Image src="/img/account.svg" width={64} height={64} alt='username' className="me-3" />
                <input type="text" name="username" id="username" className="border_custom login_form" placeholder="username" defaultValue={userData.name} />
              </div>
              <div className="input_wrapper d-flex align-items-center">
                <Image src="/img/password.svg" width={64} height={64} alt='password' className="me-3" />
                <input type="password" name="oldPassword" id="oldPassword" className="border_custom login_form" placeholder="old password" />
              </div>
              <div className="input_wrapper d-flex align-items-center">
                <Image src="/img/password.svg" width={64} height={64} alt='password' className="me-3" />
                <input type="password" name="password" id="password" className="border_custom login_form" placeholder="new password" />
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