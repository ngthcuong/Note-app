import type React from 'react';
import type { Note } from '../interfaces/Note';

interface NoteCardProps extends Note {
  viewNote: (id: string) => void;
  deleteNote: (id: string) => void;
}

// Destructuring
const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  updatedAt,
  viewNote,
  deleteNote,
}) => {
  return (
    <div className='my-4 flex justify-between rounded-lg border p-2'>
      {/* Nội dung chính của ghi chú */}
      <div className='mr-4 flex-3'>
        <div className='border-b-1 border-gray-300 pb-0.5 pl-1 text-lg font-bold'>
          {title}
        </div>

        <div className='mt-2 border-b-1 border-gray-300 pb-0.5 pl-1 text-lg'>
          {content}
        </div>

        <div className='mt-2 pl-1 text-sm'>
          Cập nhật lúc: {updatedAt.toLocaleDateString()}
        </div>
      </div>

      {/* Các nút hành động */}
      <div className='flex flex-1 flex-col items-center justify-center gap-2'>
        <button
          type='button'
          className='max-h-fit w-full grow-1 cursor-pointer rounded-lg bg-blue-500 py-2 font-semibold text-white'
          onClick={() => viewNote(id)}
        >
          Xem chi tiết
        </button>
        <button
          type='button'
          className='max-h-fit w-full grow-1 cursor-pointer rounded-lg bg-red-600 py-2 font-semibold text-white'
          onClick={() => deleteNote(id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
