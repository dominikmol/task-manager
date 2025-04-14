
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/authContext.js';
import pb from '@/app/services/pocketbase';

export default function AccountEditPage() {
  const { user, setUser } = useAuth(); 
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // opóźnienie renderowania komponentu, by dane były dostępne
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!isMounted) {
    return null; // jeśli komponent nie jest zamontowany, nie renderuj nic
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    
    const updateData = {
      email,
      username,
    };

    
    if (password) {
      updateData.password = password;
    }

    try {
      const updatedUser = await pb.collection('users').update(user.id, updateData);
      
      if (setUser) {
        setUser(updatedUser);
      }
      setSuccess('User data has been updated ');
    } catch (err) {
      console.error(err);
      setError('There was a problem with updating the data.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Edycja konta</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nazwa użytkownika</label>
          <input 
            type="text" 
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Adres e-mail</label>
          <input 
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Nowe hasło <small className="text-muted">(pozostaw puste, jeśli nie chcesz zmieniać)</small>
          </label>
          <input 
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Zapisz zmiany</button>
      </form>
    </div>
  );
}
