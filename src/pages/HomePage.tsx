import type React from 'react';
import NoteCard from '../components/NoteCard';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useEffect, useState } from 'react';
import type { Note } from '../interfaces/Note';
import classNames from 'classnames';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Cách 1: Sử dụng context như bình thường
   */
  // const context = useContext(NotesContext);
  // const notes = context?.notes || [];
  // const deleteNote = context?.deleteNote || (() => {});

  /**
   * Cách 2: Sử dụng custom hook để gọi các hàm và biến
   */
  const { notes, deleteNote } = useNotes();

  const [keyword, setKeyword] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
  const [layout, setLayout] = useState<string>('column');

  const handleViewNote = (id: string) => {
    navigate(`/notes/${id}`);
  };

  const handleSearchNote = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredNotes(notes);
    }

    if (keyword.trim()) {
      const foundNotes = notes.filter(note => {
        const titleMatch = note.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const contentMatch = note.content
          .toLowerCase()
          .includes(keyword.toLowerCase());
        return titleMatch || contentMatch;
      });

      setFilteredNotes(foundNotes);
    }
  };

  useEffect(() => {
    handleSearchNote(keyword);
  }, [keyword, notes]);

  return (
    <div className='m-auto flex h-[calc(100vh-60px)] max-w-7xl flex-col rounded-2xl border p-2 sm:p-4 lg:p-6'>
      {/* Tiêu đề */}
      <div className='text-center text-xl font-extrabold sm:text-3xl'>
        Danh sách các ghi chú
      </div>

      {/* Phần điều khiển */}
      <div className='mt-2 flex flex-col justify-between gap-2 sm:flex-row'>
        {/* Chọn kiểu hiển thị các ghi chú: theo hàng hoặc theo bảng */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <div className='font-medium'>Sắp xếp theo dạng:</div>
            <form className='ml-2 flex gap-2'>
              <div className='flex items-center gap-1'>
                <input
                  type='radio'
                  value='column'
                  id='column'
                  name='viewType'
                  defaultChecked
                  onClick={() => setLayout('column')}
                />
                <label htmlFor='column'>Cột</label>
              </div>
              <div className='flex items-center gap-1'>
                <input
                  type='radio'
                  value='grid'
                  id='grid'
                  name='viewType'
                  onClick={() => setLayout('grid')}
                />
                <label htmlFor='grid'>Lưới</label>
              </div>
            </form>
          </div>
          <div className='mt-2 flex items-center'>
            <div className='font-semibold'>Tìm kiếm: </div>
            <input
              type='text'
              className='ml-2 w-fit rounded-md border py-1 pl-1 sm:w-64'
              value={keyword}
              placeholder='Tìm kiếm ghi chú theo từ khóa ...'
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
        </div>
        {/* Nút thêm ghi chú mới */}
        <button
          className='h-fit cursor-pointer rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white sm:px-4 sm:py-2 sm:text-base'
          onClick={() => navigate('/create-note')}
        >
          Tạo ghi chú mới
        </button>
      </div>

      {/* Danh sách ghi chú */}
      <div
        className={classNames('mt-3 flex-1 gap-4 overflow-y-auto', {
          'flex flex-col': layout === 'column',
          'grid auto-rows-max grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
            layout === 'grid',
        })}
      >
        {filteredNotes.length === 0 && !keyword && (
          <div className='col-span-full flex h-full min-h-[300px] items-center justify-center text-center'>
            <div className='text-lg text-gray-500 sm:text-xl'>
              <div>Hiện không có ghi chú nào.</div>
              <div className='mt-1 text-sm text-gray-400 sm:text-base'>
                Hãy tạo mới để hiển thị.
              </div>
            </div>
          </div>
        )}
        {filteredNotes.length === 0 && keyword && (
          <div className='col-span-full flex h-full min-h-[300px] items-center justify-center text-center'>
            <div className='text-lg text-gray-500 sm:text-xl'>
              <div>Không tìm thấy ghi chú nào</div>
              <div className='mt-1 text-sm text-gray-400 sm:text-base'>
                chứa từ khóa "<span className='font-semibold'>{keyword}</span>"
              </div>
            </div>
          </div>
        )}
        {filteredNotes
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map(item => {
            return (
              <NoteCard
                {...item}
                key={item.id}
                searchKeyword={keyword}
                layout={layout}
                viewNote={() => handleViewNote(item.id)}
                deleteNote={() => {
                  deleteNote(item.id);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default HomePage;
