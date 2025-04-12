'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext.js';
import pb from '@/app/services/pocketbase';

export default function TaskEditPage() {
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
                <h1>tu będzie TaskEditPage</h1>
            ) : (
                <h1>Error 418 I&apos;m a teapot</h1>
            )
            }
        </>
    );
}
