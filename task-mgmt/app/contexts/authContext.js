'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/app/services/pocketbase.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, username, password) => {
    try {
      const newUser = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name: username,
        current_lvl: 1,
        current_xp: 0,
        current_max_xp: 100,
      });
      await login(email, password);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      setUser(pb.authStore.model);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
