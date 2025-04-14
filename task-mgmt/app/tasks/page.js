'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import pb from '@/app/services/pocketbase';
import Image from 'next/image.js';
import Link from 'next/link.js';

export default function TasksPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [userData, setUserData] = useState([]);
  const [userLvlP, setUserLvlP] = useState(0);
  const router = useRouter();

  const taskDifficultyDict = {
    1: 'very easy',
    2: 'easy',
    3: 'medium',
    4: 'hard',
    5: 'very hard',
  }

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
          console.log('Error fetching tasks:', error);
          setLoading(false);
        });
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      pb.collection('users').getOne(user.id)
        .then((data) => {
          setUserData(data);
          const pxp = (data.current_xp / data.current_max_xp) * 100;
          setUserLvlP(pxp);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, [user, userData]);

  function sortChange(e) {
    e.preventDefault();
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
  }

  function sortTasks(tasks, sortBy) {
    const sortedTasks = [...tasks]; // Tworzymy kopię tablicy, aby nie mutować oryginału
    switch (parseInt(sortBy)) {
      case 1:
        return sortedTasks.sort((a, b) => new Date(a.created) - new Date(b.created)); // Sortowanie po dacie dodania rosnąco
      case 2:
        return sortedTasks.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sortowanie po dacie dodania malejąco
      case 3:
        return sortedTasks.sort((a, b) => a.task_lvl - b.task_lvl); // Sortowanie po poziomie trudności rosnąco
      case 4:
        return sortedTasks.sort((a, b) => b.task_lvl - a.task_lvl); // Sortowanie po poziomie trudności malejąco
      case 5:
        return sortedTasks.sort((a, b) => new Date(a.finish_before) - new Date(b.finish_before)); // Sortowanie po dacie zakończenia rosnąco
      case 6:
        return sortedTasks.sort((a, b) => new Date(b.finish_before) - new Date(a.finish_before)); // Sortowanie po dacie zakończenia malejąco
      default:
        return sortedTasks.sort((a, b) => new Date(a.created) - new Date(b.created)); // Domyślne sortowanie po dacie dodania rosnąco
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
  }

  function handleTaskDelete(id) {
    pb.collection('tasks').delete(id)
      .then(() => {
        setSelectedTask(null); // Resetowanie wybranego zadania po usunięciu
        router.push('/');
      })
      .catch((error) => {
        console.log('Error deleting task:', error);
      });
  }

  function handleEditDone(task) {
    sessionStorage.setItem("taskToEdit", JSON.stringify(task));
    router.push("/tasks/edit");
  }

  function handleTaskDone(task) {
    pb.collection('tasks').update(task['id'], { is_done: true })
      .then(() => {
        setSelectedTask(null); // Resetowanie wybranego zadania po usunięciu
      })
      .catch((error) => {
        console.log('Error updating task:', error);
      });
    const dueDate = new Date(task['finish_before']);
    const currentDate = new Date();
    if (dueDate < currentDate) { // sprawdzanie czy po terminie
      const points = (task.task_lvl * 5) / 2;
      // sprawdzanie czy po dodaniu punktów nie przekroczy maksymalnego xp
      if (userData.current_xp + points >= userData.current_max_xp) {
        pb.collection('users').update(user.id, {
          current_xp: 0,
          current_max_xp: userData.current_max_xp + (userData.current_max_xp * 0.25),
          current_lvl: userData.current_lvl + 1,
        })
      } else {
        pb.collection('users').update(user.id, {
          current_xp: userData.current_xp + points,
        })
      }
      // gdy termin nie został przekroczony
    } else {
      const points = (task.task_lvl * 5);
      // sprawdzanie czy po dodaniu punktów nie przekroczy maksymalnego xp
      if (userData.current_xp + points >= userData.current_max_xp) {
        pb.collection('users').update(user.id, {
          current_xp: 0,
          current_max_xp: userData.current_max_xp + (userData.current_max_xp * 0.25),
          current_lvl: userData.current_lvl + 1,
        })
      } else {
        pb.collection('users').update(user.id, {
          current_xp: userData.current_xp + points,
        })
      }
      router.push('/');
    }
  }

  if (!isMounted) {
    return null; // jeśli nie jest zamontowany, nie renderuj nic
  }

  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-md-3">
          <div className="d-flex w-100 mb-2">
            <select name="sort" onChange={sortChange} className="border_custom button_style btn btn-outline-secondary me-2" defaultValue="">
              <option value="" disabled hidden>sort</option>
              <option value="1">by added date ^</option>
              <option value="2">by added date v</option>
              <option value="3">by difficulty ^</option>
              <option value="4">by difficulty v</option>
              <option value="5">by due date ^</option>
              <option value="6">by due date v</option>
            </select>
          </div>
        </div>
        <div className="col-md-9">
          <div className="lvl-panel border_custom mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="progress flex-grow-1" style={{ height: '30px' }}>
                  <div className="progress-bar level-bar" role="progressbar" style={{ width: '${parseInt(userLvlP)}%' }} aria-valuenow={parseInt(userLvlP)} aria-valuemin="0" aria-valuemax="100">{userData.current_xp}XP/{userData.current_max_xp}XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="task_wrapper border_custom">
            {loading ? (
              <div className="task p-4">
                <h1>loading tasks...</h1>
              </div>
            ) : (
              tasks.length > 0 ? (
                sortTasks(tasks, sortBy).
                  filter((task) => task.is_done === false).map((task) => (
                    <div className={`task p-4 ${selectedTask && task.id === selectedTask.id ? 'active' : ''}`} key={task.id} onClick={() => handleTaskClick(task)}>
                      <h1>{task.task_name}</h1>
                      <h6>task lvl: {taskDifficultyDict[task.task_lvl]}</h6>
                      <h6>due by: {formatDate(task.finish_before)}</h6>
                      <p>{task.task_description.substring(0, 20)}</p>
                    </div>
                  ))
              ) : (
                <div className="task p-4">
                  <h1>No tasks available</h1>
                </div>
              ))}
          </div>
        </div>
        <div className="col-md-9 task_content_wrapper d-flex flex-column flex-grow-1 border_custom p-3">
          {selectedTask ? (
            <>
              <div className="task_edit ms-auto">
                <Link href="/tasks/edit" style={{ textDecoration: "none" }}>
                  <button className="border_custom button_style" onClick={() => handleEditDone(selectedTask)}>
                    <Image src="/img/edit.svg" width={32} height={32} alt='edit' />
                    edit
                  </button>
                </Link>
              </div>

              <div className="task_content mx-auto">
                <h5 className="task_title text-center mt-3">{selectedTask['task_name']}</h5>
                <p className="task_title text-center mt-3">difficulty: {taskDifficultyDict[selectedTask['task_lvl']]}</p>
                <p className="task_title text-center mt-3">due by: {formatDate(selectedTask['finish_before'])}</p>
                <p className="task_text text-center mt-3">
                  {selectedTask['task_description']}
                </p>
              </div>

              <div className="d-flex ms-auto gap-2 mt-auto">
                <button className="border_custom button_style" onClick={() => handleTaskDelete(selectedTask['id'])}>
                  <Image src="/img/delete.svg" width={32} height={32} alt='delete' />
                  delete
                </button>
                <button className="border_custom button_style" onClick={() => handleTaskDone(selectedTask)}>
                  <Image src="/img/task_done.svg" width={32} height={32} alt='task done' />
                  done
                </button>
              </div>
            </>
          ) : (
            <div className="task_content mx-auto">
              <h5 className="task_title text-center mt-3">select task to view details</h5>
            </div>
          )
          }
        </div>
      </div>
      <div className="input_wrapper text-end mt-2">
        <Link href="/tasks/new" style={{ textDecoration: "none" }}>
          <button className="border_custom button_style">
            <Image src="/img/task_done.svg" width={32} height={32} alt='task done' /> New Task
          </button>
        </Link>
      </div>
    </div>
  );
}
