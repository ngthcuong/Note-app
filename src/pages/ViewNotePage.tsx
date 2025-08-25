import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useAppDispatch } from '../hooks';
import { openSnackbar } from '../redux/slices/snackBarSlice';
import NoteForm from '../components/NoteForm';

const ViewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { deleteNote } = useNotes();
  const dispatch = useAppDispatch();

  if (!id) {
    alert('ID ghi chú không hợp lệ');
    navigate('/');
    return null;
  }

  const handleDeleteNote = (id: string) => {
    if (!id) return;
    deleteNote(id);
    dispatch(openSnackbar({ message: 'Đã xóa ghi chú thành công' }));
    navigate('/');
  };

  return <NoteForm mode='edit' noteId={id} onDelete={handleDeleteNote} />;
};

export default ViewNotePage;
