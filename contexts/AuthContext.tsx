'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  hasStoredPin: (phone: string) => boolean;
  verifyPin: (phone: string, inputPin: string) => boolean;
  savePin: (phone: string, pin: string) => void;
  getPinForPhone: (phone: string) => string | null;
  lastUser: { phone: string; name: string; image?: string } | null;
  clearLastUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'zinco_auth';
const USER_STORAGE_KEY = 'zinco_user';
const PIN_STORAGE_KEY = 'zinco_user_pins';
const LAST_USER_KEY = 'zinco_last_user';

interface StoredPin {
  phone: string;
  pin: string;
}

interface LastUserInfo {
  phone: string;
  name: string;
  image?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storedPins, setStoredPins] = useState<StoredPin[]>([]);
  const [lastUser, setLastUser] = useState<LastUserInfo | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const authData = localStorage.getItem(AUTH_STORAGE_KEY);
        const userData = localStorage.getItem(USER_STORAGE_KEY);
        const pinsData = localStorage.getItem(PIN_STORAGE_KEY);
        const lastUserData = localStorage.getItem(LAST_USER_KEY);

        setIsAuthenticated(authData === 'true');
        setUser(userData ? JSON.parse(userData) : null);
        setStoredPins(pinsData ? JSON.parse(pinsData) : []);
        setLastUser(lastUserData ? JSON.parse(lastUserData) : null);
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = (userData: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    const lastUserInfo: LastUserInfo = {
      phone: userData.phone,
      name: userData.name,
      image: userData.profilePicture,
    };
    localStorage.setItem(LAST_USER_KEY, JSON.stringify(lastUserInfo));

    setIsAuthenticated(true);
    setUser(userData);
    setLastUser(lastUserInfo);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

    const lastUserInfo: LastUserInfo = {
      phone: updatedUser.phone,
      name: updatedUser.name,
      image: updatedUser.profilePicture,
    };
    localStorage.setItem(LAST_USER_KEY, JSON.stringify(lastUserInfo));

    setUser(updatedUser);
    setLastUser(lastUserInfo);
  };

  const hasStoredPin = (phone: string): boolean => {
    return storedPins.some(p => p.phone === phone);
  };

  const getPinForPhone = (phone: string): string | null => {
    const found = storedPins.find(p => p.phone === phone);
    return found ? found.pin : null;
  };

  const verifyPin = (phone: string, inputPin: string): boolean => {
    const storedPin = getPinForPhone(phone);
    return storedPin === inputPin;
  };

  const savePin = (phone: string, pin: string) => {
    const existingPins = [...storedPins];
    const existingIndex = existingPins.findIndex(p => p.phone === phone);
    
    if (existingIndex >= 0) {
      existingPins[existingIndex].pin = pin;
    } else {
      existingPins.push({ phone, pin });
    }

    localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(existingPins));
    setStoredPins(existingPins);
  };

  const clearLastUser = () => {
    localStorage.removeItem(LAST_USER_KEY);
    setLastUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        updateProfile,
        hasStoredPin,
        verifyPin,
        savePin,
        getPinForPhone,
        lastUser,
        clearLastUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
