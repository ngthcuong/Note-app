import type React from 'react';
import NoteCard from '../components/NoteCard';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';

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

  const handleViewNote = (id: string) => {
    navigate(`/view-note/${id}`);
  };

  return (
    <div className='m-auto mt-4 max-w-7xl rounded-2xl border p-4'>
      {/* Tiêu đề */}
      <div className='text-center text-3xl font-extrabold'>
        Danh sách các ghi chú
      </div>

      {/* Phần điều khiển */}
      <div className='mt-2 flex justify-between'>
        {/* Chọn kiểu hiển thị các ghi chú: theo hàng hoặc theo bảng */}
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
              />
              <label htmlFor='column'>Cột</label>
            </div>
            <div className='flex items-center gap-1'>
              <input type='radio' value='grid' id='grid' name='viewType' />
              <label htmlFor='grid'>Lưới</label>
            </div>
          </form>
        </div>
        {/* Nút thêm ghi chú mới */}
        <button
          className='cursor-pointer rounded-xl bg-green-600 px-2 py-1 font-semibold text-white'
          onClick={() => navigate('/create-note')}
        >
          Tạo ghi chú mới
        </button>
      </div>

      {/* Danh sách ghi chú */}
      <div className='mt-3 h-[calc(100vh-12rem)] overflow-y-auto'>
        {notes.length === 0 && (
          <div className='text-center text-xl'>
            Hiện không có ghi chú nào. Hãy tạo mới để hiển thị.
          </div>
        )}
        {notes
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map(item => {
            return (
              <NoteCard
                {...item}
                key={item.id}
                viewNote={() => handleViewNote(item.id)}
                deleteNote={() => {
                  deleteNote(item.id);
                  alert('Xóa ghi chú thành công');
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default HomePage;
