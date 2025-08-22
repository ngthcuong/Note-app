import { createContext, useContext, useState, type ReactNode } from 'react';
import type React from 'react';
import type { Note } from '../interfaces/Note';
import { mockPost } from '../assets/mockPost';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
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

  const addNote = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  // Partial<T> biến tất cả các properties của type T thành optional (? - có thể có hoặc không)
  // Required<T> ngược lại với Partial
  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updatedNote, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    console.log(notes);
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export { NotesProvider, NotesContext, useNotes };
