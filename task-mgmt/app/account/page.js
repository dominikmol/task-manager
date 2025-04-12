'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authContext.js';
import pb from '@/app/services/pocketbase';

export default function AccountPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(null); // stan do przechowywania danych użytkownika
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openTasksNumber, setOpenTasksNumber] = useState(0);
  const [closedTasksNumber, setClosedTasksNumber] = useState(0);
  const [allTasksNumber, setAllTasksNumber] = useState(0);

  useEffect(() => {
    setIsMounted(true); // opóźnienie renderowania komponentu do momentu, by się poprawnie wczytywało po odświeżeniu
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      setLoading(true); // stanu ładowania by czekało na wczytanie danych
      pb.collection('tasks').getFullList({ filter: `user_id = "${user.id}"` })
        .then((data) => {
          setTasks(data);
          setLoading(false); // kończenie ładowania po wczytaniu danych
        }
        ).catch((error) => {
          console.error('Error fetching tasks:', error);
          setLoading(false);
        });
      setAllTasksNumber(tasks.length); // ustawienie liczby wszystkich zadań
      const openTasks = tasks.filter(task => task.is_done === false).length; // filtracja zadań otwartych
      setOpenTasksNumber(openTasks); // ustawienie liczby zadań otwartych
      const closedTasks = tasks.filter(task => task.is_done === true).length; // filtracja zadań zamkniętych
      setClosedTasksNumber(closedTasks); // ustawienie liczby zadań zamkniętych
    }
  }, [user, router, allTasksNumber, openTasksNumber, closedTasksNumber, tasks]);

  if (!isMounted) {
    return null; // jeśli nie jest zamontowany, nie renderuj nic
  }

  return (
    <div>
      {user ? (
        <div class="container d-flex flex-grow-1 main">
          <div class="user_page my-auto main_wrapper d-flex flex-column align-items-center mx-auto border_custom">
            <div class="stats d-flex justify-content-between my-4 w-75">
              <div class="stat_info border_custom button_style">open tasks: {openTasksNumber}</div>
              <div class="stat_info border_custom button_style">closed tasks: {closedTasksNumber}</div>
              <div class="stat_info border_custom button_style">all tasks: {allTasksNumber}</div>
              <div class="stat_info border_custom button_style">current lvl: {user.current_lvl}</div>
            </div>
            <div>
              <div class="d-flex align-items-center my-4">
                {/* <img src="assets/person_64dp_EBD478_FILL0_wght200_GRAD0_opsz48.svg" alt="" class="me-3"> */}
                <p class="border_custom button_style mb-0">name: {user.name}</p>
              </div>
              <div class="d-flex align-items-center my-4">
                {/* <img src="assets/mail_64dp_EBD478_FILL0_wght200_GRAD0_opsz48.svg" alt="" class="me-3"> */}
                <p class="border_custom button_style mb-0">email: {user.email}</p>
              </div>
            </div>
            <div >
              <button class="border_custom button_style">edit</button>
            </div>
          </div>
        </div>
      ) : (
        <h1>Error 418 I&apos;m a teapot</h1>
      )}
    </div>
  );
}