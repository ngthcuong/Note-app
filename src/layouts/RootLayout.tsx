import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import { CircularProgress } from '@mui/material';

const RootLayout: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
