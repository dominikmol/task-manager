'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import Image from 'next/image'
import pb from '@/app/services/pocketbase';

export default function NewTaskPage() {
    const { user } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // opóźnienie renderowania komponentu do momentu, by się poprawnie wczytywało po odświeżeniu
    }, []);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    function handleSubmit(e) {
        e.preventDefault();
        const date = e.target.date.value;
        const taskLevel = e.target.taskLevel.value;
        const description = e.target.description.value;
        const taskname = e.target.taskname.value;
        pb.collection('tasks').create({
            task_name: taskname,
            task_lvl: taskLevel,
            finish_before: date,
            task_description: description,
            user_id: user.id,
        })
            .then((data) => {
                router.push('/tasks');
            })
            .catch((error) => {
                console.log('Error creating task:', error);
            })
    }

    if (!isMounted) {
        return null; // jeśli nie jest zamontowany, nie renderuj nic
    }

    return (
        <>
            {user ? (
                <div className="container main m-4" id="newtask">
                    <div className="user_page main_wrapper border_custom login_form mx-auto">
                        <form action="" className="row justify-content-center">
                            <div className="col-md-6">
                                <input type="text" placeholder="username" className="border_custom login_form" />
                                <input className="border_custom login_form" type="date" />
                                <select className="border_custom login_form" name="cars" id="data">
                                    <option value="volvo">task LVL</option>
                                    <option value="volvo">1</option>
                                    <option value="saab">2</option>
                                    <option value="opel">3</option>
                                    <option value="audi">4</option>
                                </select>
                                <div className="w-100"></div>
                                <textarea placeholder="description" name="" className="border_custom login_form mx-auto"></textarea>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex flex-column"></div>
                                <button className="border_custom login_form w-100" type="reset">
                                    <Image src="/img/cancel.svg" width={32} height={32} alt='cancel' />
                                    cancel
                                </button>

                                <button className="border_custom login_form w-100" type="submit">
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
