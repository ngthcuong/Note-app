import type React from 'react';
import type { Note } from '../interfaces/Note';
import HighlightText from './HighlightText';
import classNames from 'classnames';

interface NoteCardProps extends Note {
  viewNote: (id: string) => void;
  deleteNote: (id: string) => void;
  searchKeyword?: string;
  layout?: string;
}

// Destructuring
const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  updatedAt,
  viewNote,
  deleteNote,
  layout = 'column',
  searchKeyword = '',
}) => {
  // Giới hạn hiển thị nếu tiêu đề hoặc nội dung quá dài
  const maxLength = 100;
  const displayContent =
    content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  const displayTitle =
    title.length > maxLength ? title.substring(0, maxLength) + '...' : title;

  return (
    <div
      className={classNames(
        'flex h-fit flex-col justify-between rounded-lg border p-2 sm:flex-row',
        {
          'md:flex-col': layout === 'grid',
          'md:flex-row': layout === 'column',
        }
      )}
    >
      {/* Nội dung chính của ghi chú */}
      <div className='mr-4 flex-3'>
        <div className='border-b-1 border-gray-300 pb-0.5 pl-1 font-bold sm:text-lg'>
          {/* {displayTitle} */}
          <HighlightText text={displayTitle} keyword={searchKeyword} />
        </div>

        <div className='mt-2 border-b-1 border-gray-300 pb-0.5 pl-1 text-base sm:text-lg'>
          {/* {displayContent} */}
          <HighlightText text={displayContent} keyword={searchKeyword} />
        </div>

        <div className='mt-2 pl-1 text-xs sm:text-sm'>
          Cập nhật lúc: {updatedAt.toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Các nút hành động */}
      <div
        className={classNames('mt-2 flex gap-2', {
          'flex-1 flex-row items-center justify-center sm:flex-col':
            layout === 'column',
          'flex-col sm:flex-col md:flex-col': layout === 'grid',
        })}
      >
        <button
          type='button'
          className='max-h-fit w-full grow-1 cursor-pointer rounded-lg bg-blue-500 py-1 font-semibold text-white sm:py-1.5 lg:py-2'
          onClick={() => viewNote(id)}
        >
          Xem chi tiết
        </button>
        <button
          type='button'
          className='max-h-fit w-full grow-1 cursor-pointer rounded-lg bg-red-600 py-1 font-semibold text-white sm:py-1.5 lg:py-2'
          onClick={() => deleteNote(id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
