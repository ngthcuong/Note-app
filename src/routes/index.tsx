import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CreateNotePage from '../pages/CreateNotePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/create-note',
    element: <CreateNotePage />,
  },
]);

export default router;
