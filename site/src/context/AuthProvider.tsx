import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../types/user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserStatus = async () => {
    fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('User not authenticated');
        }
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    checkUserStatus();
  }, []);

  const handleSignout = async () => {
    const signoutUrl = `${import.meta.env.VITE_USERS_SERVICE}/auth/signout`;
    await fetch(signoutUrl, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      setUser(null);
    });
  };
  return (
    <AuthContext.Provider
      value={{ user, isLoading, handleSignout, checkUserStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
