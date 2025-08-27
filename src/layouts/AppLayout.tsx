import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';

const AppLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
