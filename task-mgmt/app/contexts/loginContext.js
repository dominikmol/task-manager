'use client';
import { createContext, useContext, useState } from 'react';
const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  return useContext(LoginContext);
}