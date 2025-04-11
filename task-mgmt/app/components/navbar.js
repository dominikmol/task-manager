'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogin } from '../contexts/loginContext.js'

export default function Navbar() {
    const { loggedIn, setLoggedIn } = useLogin();
    const router = useRouter();

    async function onSubmit(e) {
        e.preventDefault()
        setLoggedIn(true)
        router.push('/tasks');
    }

    return (
        <nav className="container-fluid header border_custom">
            <div className="row align-items-center">
                <div className="logo col-3">
                    <Link href={loggedIn?"/tasks":"/"} style={{ textDecoration: "none" }}>
                        <span className="logo">QUESTIFY</span>
                    </Link>
                </div>
                <div className="login_form_wrapper col-6 ms-auto">
                    {loggedIn ? (
                        <div className="d-flex my-0 justify-content-end">
                            <Link href="/account">
                                <button className="border_custom button_style mx-4">my account</button>
                            </Link>
                            <button className="border_custom button_style" onClick={() => setLoggedIn(false)}>logout</button>
                        </div>
                    ): (
                        <form className="d-flex my-0 justify-content-end"  onSubmit={onSubmit}>
                            <input type="text" id="username" name="username" placeholder="username" className="border_custom login_form ms-auto" />
                            <input type="password" id="password" name="password" placeholder="password" className="border_custom login_form mx-4" />
                            <input type="submit" value="login" className="border_custom button_style" />
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
  }
  