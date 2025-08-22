import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.tsx';
import { NotesProvider } from './contexts/NotesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotesProvider>
      <RouterProvider router={router} />
    </NotesProvider>
  </StrictMode>
);
