import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress size={40} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
