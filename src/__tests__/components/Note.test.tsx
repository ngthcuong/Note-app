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

  const user = userEvent.setup();

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
    renderNoteCard();
    const deleteBtn = screen.getByRole('button', { name: /xóa/i });

    await user.click(deleteBtn);

    expect(mockProps.deleteNote).toHaveBeenCalledTimes(1);
    expect(mockProps.deleteNote).toHaveBeenCalledWith(tempId);
  });

  test('should call viewNote and navigate to page view note when press button Xem chi tiet', async () => {
    renderNoteCard();
    const viewBtn = screen.getByRole('button', { name: /xem chi tiết/i });

    await user.click(viewBtn);
    expect(mockProps.viewNote).toHaveBeenCalledTimes(1);
    expect(mockProps.viewNote).toHaveBeenCalledWith(tempId);
    // expect(window.location.pathname).toContain(`/notes/${tempId}`);
  });
});
