'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import Image from 'next/image';
import pb from '@/app/services/pocketbase';

export default function TaskEditPage() {
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const [formatedDate, setFormatedDate] = useState('');

    useEffect(() => {
        setIsMounted(true); // opóźnienie renderowania komponentu do momentu, by się poprawnie wczytywało po odświeżeniu
    }, []);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    useEffect(() => {
        const storedTask = sessionStorage.getItem('taskToEdit');
        if (storedTask) {
            setTask(JSON.parse(storedTask));
            console.log('Task to edit:', JSON.parse(storedTask));
            setFormatedDate(new Date(JSON.parse(storedTask).finish_before).toISOString().slice(0, 16));
        } else {
            router.push('/tasks');
        }
    }, [router]);

    if (!isMounted) {
        return null; // jeśli nie jest zamontowany, nie renderuj nic
    }

    function handleSubmit(e) {
        e.preventDefault();
        const date = e.target.date.value;
        const taskLevel = e.target.taskLevel.value;
        const description = e.target.description.value;
        const taskname = e.target.taskname.value;
        const isoDate = new Date(date).toISOString();
        pb.collection('tasks').update(task['id'], {
            task_name: taskname,
            task_lvl: taskLevel,
            finish_before: isoDate,
            task_description: description,
        })
            .then(() => {
                router.push('/tasks');
            })
            .catch((error) => {
                console.log('Error updating task:', error);
            });
    }

    return (
        <>
            {user ? (
                <div className="container main my-auto" id="newtask">
                    <div className="user_page main_wrapper border_custom login_form mx-auto d-flex flex-column">
                        <form onSubmit={handleSubmit} className="row justify-content-center flex-grow-1 pb-3 pe-2">
                            <div className="col-md-8 offset-2 d-flex flex-column">
                                <div className="inputs_new d-flex mt-4 justify-content-between">
                                    <input type="text" placeholder="taskname" id='taskname' name='taskname' className="border_custom login_form" defaultValue={task.task_name} />
                                    <input className="border_custom login_form" type="datetime-local" name='date' defaultValue={formatedDate} />
                                    <select name="taskLevel" className="border_custom login_form" defaultValue="$(task.task_lvl)">
                                        <option value="" disabled hidden>task LVL</option>
                                        <option value="1">very easy</option>
                                        <option value="2">easy</option>
                                        <option value="3">medium</option>
                                        <option value="4">hard</option>
                                        <option value="5">very hard</option>
                                    </select>
                                </div>
                                <div className="w-100"></div>
                                <textarea placeholder="description" name="description" className="mt-5 border_custom login_form mx-auto w-100" style={{ resize: 'none' }} defaultValue={task.task_description}></textarea>
                            </div>
                            <div className="col-md-2 mt-auto mx-auto">
                                <div className="d-flex flex-column">
                                    <button className="border_custom login_form w-100 mb-3" type="reset" onClick={() => router.push('/tasks')}>
                                        <Image src="/img/cancel.svg" width={32} height={32} alt='cancel' />
                                        cancel
                                    </button>

                                    <button className="border_custom login_form w-100" type="submit">
                                        <Image src="/img/save.svg" width={32} height={32} alt='save' />
                                        save
                                    </button>
                                </div>
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
