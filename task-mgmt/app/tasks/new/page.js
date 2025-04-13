'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext.js';
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

    if (!isMounted) {
        return null; // jeśli nie jest zamontowany, nie renderuj nic
    }

    return (
        <>
            {user ? (
                <div class="container main m-4" id="newtask">
                    <div class="user_page main_wrapper border_custom login_form mx-auto">
                        <form action="" class="row justify-content-center">
                            <div class="col-md-6">
                                <input type="text" placeholder="username" class="border_custom login_form" />
                                <input class="border_custom login_form" type="date" />
                                <select class="border_custom login_form" name="cars" id="data">
                                    <option value="volvo">task LVL</option>
                                    <option value="volvo">1</option>
                                    <option value="saab">2</option>
                                    <option value="opel">3</option>
                                    <option value="audi">4</option>
                                </select>
                                <div class="w-100"></div>
                                <textarea placeholder="description" name="" class="border_custom login_form mx-auto"></textarea>
                            </div>
                            <div class="col-md-3">
                                <div class="d-flex flex-column"></div>
                                <button class="border_custom login_form w-100" type="reset">
                                    <Image src="/img/cancel.svg" width={64} height={64} alt='cancel' />
                                    cancel
                                </button>

                                <button class="border_custom login_form w-100" type="submit">
                                    <Image src="/img/save.svg" width={64} height={64} alt='save' />
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
