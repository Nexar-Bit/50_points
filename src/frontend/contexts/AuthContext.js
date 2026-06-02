'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchJson, fetchAuthJson } from '@/frontend/lib/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    try {
      const data = await fetchJson('/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(data.user);
      return data.user;
    } catch {
      localStorage.removeItem('50points_token');
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = localStorage.getItem('50points_token');
      if (stored) {
        setToken(stored);
        // Unblock route rendering immediately; refresh user in background.
        if (!cancelled) setLoading(false);
        fetchUser(stored);
        return;
      }

      const guestStored = localStorage.getItem('50points_guest_token');
      if (guestStored) {
        if (!cancelled) setLoading(false);
        try {
          const data = await fetchJson('/auth/guest/resume', {
            method: 'POST',
            body: JSON.stringify({ guestToken: guestStored }),
            timeoutMs: 10000,
          });
          if (cancelled) return;
          localStorage.setItem('50points_token', data.token);
          setToken(data.token);
          setUser(data.user);
        } catch {
          localStorage.removeItem('50points_guest_token');
        }
      }
      if (!cancelled) setLoading(false);
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [fetchUser]);

  const login = async (identifier, password) => {
    const data = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: identifier, password }),
    });
    localStorage.setItem('50points_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const data = await fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    localStorage.setItem('50points_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const playAsGuest = async () => {
    const data = await fetchJson('/auth/guest', { method: 'POST' });
    localStorage.setItem('50points_token', data.token);
    if (data.guestToken) {
      localStorage.setItem('50points_guest_token', data.guestToken);
    }
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('50points_token');
    localStorage.removeItem('50points_guest_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return null;
    return fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        // Token presence enables protected navigation while profile refresh is in-flight.
        isAuthenticated: !!token,
        login,
        register,
        playAsGuest,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
