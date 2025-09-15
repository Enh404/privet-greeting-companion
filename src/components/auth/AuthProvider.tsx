import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    apiClient.setToken(response.token);
    // Some backends may not include the user in the login response
    const userFromResponse = (response as any)?.user as User | undefined;
    const userData = userFromResponse ?? await apiClient.getProfile();
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
    setUser(response.user);
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
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setToken(token);
      // Try to get user info to verify token is still valid
      // This would require implementing a /user endpoint check
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
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