import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotesProvider } from '../../contexts/NotesContext';
import NoteCard from '../../components/NoteCard';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

describe('Note Component', () => {
  // Tạo dữ liệu giả
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

  // Tạo hàm giúp render các note
  const renderNoteCard = (props = {}) => {
    return render(
      <AuthProvider>
        <NotesProvider>
          <Provider store={store}>
            <NoteCard {...mockProps} {...props} />
          </Provider>
        </NotesProvider>
      </AuthProvider>
    );
  };

  // Clear mỗi lần chạy
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render note component', () => {
    renderNoteCard();

    const note = screen.getByText('note 1');
    expect(note).toBeInTheDocument();
  });

  test('should call deleteNote when delete a note', async () => {
    const user = userEvent.setup();

    const deleteBtn = screen.getByRole('button', { name: /xóa/i });

    await user.click(deleteBtn);

    expect(mockProps.deleteNote).toHaveBeenCalledTimes(1);
    expect(mockProps.deleteNote).toHaveBeenCalledWith(tempId);
  });
});
