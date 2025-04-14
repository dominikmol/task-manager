'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import pb from '@/app/services/pocketbase';
import { useAuth } from '@/app/contexts/authContext.js';
import Image from 'next/image';

export default function AccountPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [openTasksNumber, setOpenTasksNumber] = useState(0);
  const [closedTasksNumber, setClosedTasksNumber] = useState(0);
  const [allTasksNumber, setAllTasksNumber] = useState(0);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setIsMounted(true); // opóźnienie renderowania komponentu do momentu, by się poprawnie wczytywało po odświeżeniu
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      pb.collection('tasks').getFullList({ filter: `user_id = "${user.id}"` })
        .then((data) => {
          setTasks(data);
          setAllTasksNumber(tasks.length); // ustawienie liczby wszystkich zadań
          const openTasks = tasks.filter(task => task.is_done === false).length; // filtracja zadań otwartych
          setOpenTasksNumber(openTasks); // ustawienie liczby zadań otwartych
          const closedTasks = tasks.filter(task => task.is_done === true).length; // filtracja zadań zamkniętych
          setClosedTasksNumber(closedTasks); // ustawienie liczby zadań zamkniętych
        }
        ).catch((error) => {
          console.log('Error fetching tasks:', error);
        });

    }
  }, [user, router, allTasksNumber, openTasksNumber, closedTasksNumber, tasks]);

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
    return null; // jeśli nie jest zamontowany, nie renderuj nic
  }

  return (
    <>
      {user ? (
        <div className="container d-flex flex-grow-1 main">
          <div className="user_page my-auto main_wrapper d-flex flex-column align-items-center mx-auto border_custom">
            <div className="stats d-flex justify-content-between my-4 w-75">
              <div className="stat_info border_custom button_style">open tasks: {openTasksNumber}</div>
              <div className="stat_info border_custom button_style">closed tasks: {closedTasksNumber}</div>
              <div className="stat_info border_custom button_style">all tasks: {allTasksNumber}</div>
              <div className="stat_info border_custom button_style">current lvl: {userData.current_lvl}</div>
            </div>
            <div>
              <div className="d-flex align-items-center my-4">
                <Image src="/img/account.svg" width={64} height={64} alt='account' className="me-3" />
                <p className="border_custom button_style mb-0">name: {userData.name}</p>
              </div>
              <div className="d-flex align-items-center my-4">
                <Image src="/img/email.svg" width={64} height={64} alt='email' className="me-3" />
                <p className="border_custom button_style mb-0">email: {userData.email}</p>
              </div>
            </div>
            <div >
              <Link href='/account/edit' style={{ textDecoration: "none" }}>
                <button className="border_custom button_style">
                  <Image src="/img/edit.svg" width={32} height={32} alt='edit' />
                  edit
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <h1>Error 418 I&apos;m a teapot</h1>
      )}
    </>
  );
}