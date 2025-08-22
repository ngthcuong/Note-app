import type React from 'react';
import { mockPost } from '../assets/mockPost';
import NoteCard from '../components/NoteCard';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Tiêu đề */}
      <div>Danh sách các ghi chú</div>

      {/* Danh sách ghi chú */}
      <div>
        {mockPost.map(item => {
          return <NoteCard {...item} key={item.id} />;
        })}
      </div>
    </div>
  );
};

export default HomePage;
