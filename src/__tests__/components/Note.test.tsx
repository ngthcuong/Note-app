import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotesProvider } from '../../contexts/NotesContext';
import NoteCard from '../../components/NoteCard';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

describe('Note Component', () => {
  test('should render note component', () => {
    const id = crypto.randomUUID();
    render(
      <AuthProvider>
        <NotesProvider>
          <Provider store={store}>
            <NoteCard
              title='note 1'
              content='noi dung note 1'
              id={id}
              viewNote={() => {}}
              deleteNote={() => {}}
              createdAt={new Date()}
              updatedAt={new Date()}
            />
          </Provider>
        </NotesProvider>
      </AuthProvider>
    );

    const note = screen.getByText('note 1');
    expect(note).toBeInTheDocument();
  });

  test('should call deleteNote when delete a note', () => {
    const mockDeleteNote = jest.fn();
    const tempId = crypto.randomUUID();
    render(
      <AuthProvider>
        <NotesProvider>
          <Provider store={store}>
            <NoteCard
              title='note 1'
              content='noi dung note 1'
              id={tempId}
              viewNote={() => {}}
              deleteNote={mockDeleteNote}
              createdAt={new Date()}
              updatedAt={new Date()}
            />
          </Provider>
        </NotesProvider>
      </AuthProvider>
    );

    const deleteBtn = screen.getByText('Xóa');
    fireEvent.click(deleteBtn);

    expect(mockDeleteNote).toHaveBeenCalledWith(tempId);
  });
});
