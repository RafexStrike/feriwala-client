'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/types/api';
import { API_BASE_URL, getAuthUrl } from '@/lib/auth/config';
import { disableBrowserPushNotifications } from '@/lib/push/browserPush';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(getAuthUrl('/api/auth/sign-in/email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = typeof data?.message === 'string' ? data.message : 'Login failed';
      const normalizedMessage =
        message === 'Email not verified' || message === 'Email not verified.'
          ? 'Email not verified. A new verification link has been sent to your email.'
          : message;
      throw new Error(normalizedMessage || 'Login failed');
    }

    await fetchUser();
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(getAuthUrl('/api/auth/sign-up/email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await disableBrowserPushNotifications().catch(() => undefined);
    await fetch(getAuthUrl('/api/auth/sign-out'), {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  const refresh = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isVerified: user?.emailVerified ?? false,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
