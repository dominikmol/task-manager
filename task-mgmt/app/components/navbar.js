'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import Image from 'next/image';


export default function Navbar() {
    const [isMounted, setIsMounted] = useState(false);
    const { user, login, logout } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function onSubmit(e) {
        e.preventDefault()
        try {
            const email = e.target.email.value;
            const password = e.target.password.value;
            await login(email, password);
        } catch (error) {
            alert("login failed, check that your details are correct or contact support with email if you forgot your password at admin@mail.com");
        }
    }
    if (!isMounted) {
        return null;
    }

    return (
        <nav className="container-fluid header border_custom">
            <div className="row align-items-center">
                <div className="logo col-3">
                    <Link href={user ? "/tasks" : "/"} style={{ textDecoration: "none" }}>
                        <span className="logo">QUESTIFY</span>
                    </Link>
                </div>
                <div className="login_form_wrapper col-6 ms-auto">
                    {user ? (
                        <div className="d-flex my-0 justify-content-end">
                            <Link href="/account">
                                <button className="border_custom button_style mx-4">
                                    <Image src="/img/account2.svg" width={32} height={32} alt='account' />my account
                                </button>
                            </Link>
                            <button className="border_custom button_style" onClick={logout}>
                                <Image src="/img/logout.svg" width={32} height={32} alt='logoout' /> logout
                            </button>
                        </div>
                    ) : (
                        <form className="d-flex my-0 justify-content-end" onSubmit={onSubmit}>
                            <input type="text" id="email" name="email" placeholder="e-mail" className="border_custom login_form ms-auto" />
                            <input type="password" id="password" name="password" placeholder="password" className="border_custom login_form mx-4" />
                            <input type="submit" value="login" className="border_custom button_style" />
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
}
