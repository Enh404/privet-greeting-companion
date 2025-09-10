import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Dashboard } from './Dashboard';
import { LoginForm } from '@/components/auth/LoginForm';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return <LoginForm />;
};

export default Index;
