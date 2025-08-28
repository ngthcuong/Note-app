import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotesProvider } from '../../contexts/NotesContext';
import NoteCard from '../../components/NoteCard';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { MemoryRouter } from 'react-router-dom';

describe('Note Component', () => {
  const tempId = crypto.randomUUID();
  const mockProps = {
    id: tempId,
    title: 'note 1',
    content: 'noi dung note 1',
    viewNote: jest.fn(),
    deleteNote: jest.fn(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const renderNoteCard = (props = {}) => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <NotesProvider>
            <Provider store={store}>
              <NoteCard {...mockProps} {...props} />
            </Provider>
          </NotesProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render note component', () => {
    renderNoteCard();
    const note = screen.getByText('note 1');
    expect(note).toBeInTheDocument();
  });

  test('should render note content', () => {
    renderNoteCard();
    const content = screen.getByText('noi dung note 1');
    expect(content).toBeInTheDocument();
  });

  test('should call deleteNote when delete a note', async () => {
    renderNoteCard();
    const deleteBtn = screen.getByRole('button', { name: /xóa/i });

    await user.click(deleteBtn);

    expect(mockProps.deleteNote).toHaveBeenCalledTimes(1);
    expect(mockProps.deleteNote).toHaveBeenCalledWith(tempId);
  });

  test('should call viewNote and navigate when pressing view detail button', async () => {
    renderNoteCard();
    const viewBtn = screen.getByRole('button', { name: /xem chi tiết/i });

    await user.click(viewBtn);

    expect(mockProps.viewNote).toHaveBeenCalledTimes(1);
    expect(mockProps.viewNote).toHaveBeenCalledWith(tempId);
  });

  test('should handle empty title', () => {
    renderNoteCard({ title: '' });
    expect(screen.queryByText('note 1')).not.toBeInTheDocument();
  });

  test('should handle empty content', () => {
    renderNoteCard({ content: '' });
    expect(screen.queryByText('noi dung note 1')).not.toBeInTheDocument();
  });
});
