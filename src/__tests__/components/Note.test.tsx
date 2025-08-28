import { render, screen } from '@testing-library/react';
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
});
