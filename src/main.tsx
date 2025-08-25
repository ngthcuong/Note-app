import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.tsx';
import { NotesProvider } from './contexts/NotesContext.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import SnackBar from './components/SnackBar.tsx';

createRoot(document.getElementById('root')!).render(
  <NotesProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
      <SnackBar />
    </Provider>
  </NotesProvider>
);
