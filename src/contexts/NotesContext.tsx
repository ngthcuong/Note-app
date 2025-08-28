import { createContext, useContext, useState, type ReactNode } from 'react';
import type React from 'react';
import type { Note } from '../interfaces/Note';
import { mockPost, mockUser } from '../assets/mockData';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteByUser: () => Note[];
  getNoteById: (id: string) => Note | undefined;
}

// Tạo context object chưa data và func để share giữa các components
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Custom hook - giúp TS biết context không bao giờ undefined
const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// React.FC<{ children: ReactNode }> : thông báo NotesProvider là một React Functional Component
// nhận một prop là children
// ReactNote - type cho mọi thứ có thể render trong React
const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(mockPost);
  const { user } = useAuth();

  const addNote = (note: Note) => {
    if (user) {
      const userIndex = mockUser.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUser[userIndex].notes = [
          ...(mockUser[userIndex].notes ?? []),
          note,
        ];
      }
    }
  };

  // Partial<T> biến tất cả các properties của type T thành optional (? - có thể có hoặc không)
  // Required<T> ngược lại với Partial
  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    const userNotes = getNoteByUser();
    const noteIndex = userNotes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      userNotes[noteIndex] = { ...userNotes[noteIndex], ...updatedNote };
    }
  };

  const deleteNote = (id: string) => {
    if (user) {
      const userIndex = mockUser.findIndex(u => u.id === user.id);
      if (userIndex !== -1 && mockUser[userIndex].notes) {
        const noteIndex = mockUser[userIndex].notes!.findIndex(
          note => note.id === id
        );
        if (noteIndex !== -1) {
          mockUser[userIndex].notes!.splice(noteIndex, 1);
        }
      }
    }
  };

  const getNoteByUser = (): Note[] => {
    if (user) {
      return mockUser.find(u => u.id === user.id)?.notes || [];
    } else {
      return [];
    }
  };

  const getNoteById = (id: string) => {
    const userNotes = getNoteByUser();
    return userNotes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNoteByUser,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export { NotesProvider, NotesContext, useNotes };
