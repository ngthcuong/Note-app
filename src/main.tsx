import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.tsx';
import { NotesProvider } from './contexts/NotesContext.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import SnackBar from './components/SnackBar.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <NotesProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
        <SnackBar />
      </Provider>
    </NotesProvider>
  </AuthProvider>
);
