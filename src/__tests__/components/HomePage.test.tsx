import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotesProvider } from '../../contexts/NotesContext';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/HomePage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNotes = [
  {
    id: '1',
    title: 'note 1',
    content: 'noi dung note 1',
    viewNote: jest.fn(),
    deleteNote: jest.fn(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'note 2',
    content: 'noi dung note 2',
    viewNote: jest.fn(),
    deleteNote: jest.fn(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock NotesContext
jest.mock('../../contexts/NotesContext', () => ({
  NotesProvider: ({ children }: { children: React.ReactNode }) => children,
  useNotes: () => ({
    notes: mockNotes,
  }),
}));

const renderHomePage = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <NotesProvider>
          <Provider store={store}>
            <HomePage />
          </Provider>
        </NotesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

const user = userEvent.setup();

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render page title', () => {
    renderHomePage();

    expect(screen.getByText('Danh sách các ghi chú')).toBeInTheDocument();
  });

  test('should render all notes', () => {
    renderHomePage();

    expect(screen.getByText('note 1')).toBeInTheDocument();
    expect(screen.getByText('note 2')).toBeInTheDocument();
  });

  test('should navigate to note detail when clicking view button', async () => {
    renderHomePage();
    const viewBtn = screen.getAllByRole('button', { name: /xem chi tiết/i });

    await user.click(viewBtn[0]);

    // expect(mockNotes[0].viewNote).toHaveBeenCalledTimes(1);
    // expect(mockNotes[0].viewNote).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/notes/1');
  });

  test('should filter notes by search keyword', async () => {
    renderHomePage();
    const searchInput = screen.getByPlaceholderText(
      'Tìm kiếm ghi chú theo từ khóa ...'
    );

    await user.type(searchInput, '1');

    const highlightedTexts = screen.getAllByText('1');
    expect(highlightedTexts.length).toBeGreaterThan(0);
    expect(screen.queryByText('note 2')).not.toBeInTheDocument();
  });

  test('should show no results message when search returns empty', async () => {
    renderHomePage();
    const searchInput = screen.getByPlaceholderText(
      'Tìm kiếm ghi chú theo từ khóa ...'
    );

    await user.type(searchInput, 'jest');

    expect(screen.getByText('Không tìm thấy ghi chú nào')).toBeInTheDocument();
    expect(screen.getByText(/chứa từ khóa/)).toBeInTheDocument();
    expect(screen.getByText('jest')).toBeInTheDocument();
  });

  test('should clear search when keyword is empty', async () => {
    renderHomePage();
    const searchInput = screen.getByPlaceholderText(
      'Tìm kiếm ghi chú theo từ khóa ...'
    );

    await user.type(searchInput, 'React');
    await user.clear(searchInput);

    expect(screen.getByText('note 1')).toBeInTheDocument();
    expect(screen.getByText('note 2')).toBeInTheDocument();
  });
});
