import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    apiClient.setToken(response.token);
    // Backend only returns token, need to fetch user data separately
    const userData = await apiClient.getProfile();
    setUser(userData);
  };
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await apiClient.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    apiClient.setToken(response.token);
    // Backend returns token, need to fetch profile data separately
    const userData = await apiClient.getProfile();
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } finally {
      apiClient.setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiClient.setToken(token);
        try {
          const userData = await apiClient.getProfile();
          setUser(userData);
        } catch (error) {
          // Token is invalid, remove it
          apiClient.setToken(null);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};