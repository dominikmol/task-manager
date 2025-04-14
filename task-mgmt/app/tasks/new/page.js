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
                <div class="container main my-auto" id="newtask">
                    <div class="user_page main_wrapper border_custom login_form mx-auto d-flex flex-column">
                        <form action="" class="row justify-content-center flex-grow-1">
                            <div class="col-md-8 offset-2 d-flex flex-column">
                                <div class="inputs_new d-flex mt-4 justify-content-between">
                                    <input type="text" placeholder="taskname" class="border_custom login_form" />
                                    <input class="border_custom login_form" type="date" />
                                    <select class="border_custom login_form" name="cars" id="data">
                                        <option value="volvo">task LVL</option>
                                        <option value="volvo">1</option>
                                        <option value="saab">2</option>
                                        <option value="opel">3</option>
                                        <option value="audi">4</option>
                                    </select>
                                </div>
                                <div class="w-100"></div>
                                <textarea placeholder="description" name="" class="mt-5 border_custom login_form mx-auto w-100" style="resize: none;"></textarea>
                            </div>
                            <div class="col-md-2 mt-auto mx-auto">
                                <div class="d-flex flex-column">
                                    <button class="border_custom login_form w-100 mb-3" type="reset">
                                        <Image src="/img/cancel.svg" width={32} height={32} alt='cancel' />
                                        cancel
                                    </button>

                                    <button class="border_custom login_form w-100" type="submit">
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
