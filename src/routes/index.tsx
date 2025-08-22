import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CreateNotePage from '../pages/CreateNotePage';
import ViewNotePage from '../pages/ViewNotePage';

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
  {
    path: '/view-note/:id',
    element: <ViewNotePage />,
  },
]);

export default router;
