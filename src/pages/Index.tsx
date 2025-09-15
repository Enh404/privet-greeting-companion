import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Dashboard } from './Dashboard';
import { LoginForm } from '@/components/auth/LoginForm';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <LoginForm />;
};

export default Index;
