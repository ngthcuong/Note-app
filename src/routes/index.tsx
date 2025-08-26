import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CreateNotePage from '../pages/CreateNotePage';
import ViewNotePage from '../pages/ViewNotePage';
import AppLayout from '../layouts/AppLayout';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/create-note',
            element: <CreateNotePage />,
          },
          {
            path: '/notes/:id',
            element: <ViewNotePage />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
