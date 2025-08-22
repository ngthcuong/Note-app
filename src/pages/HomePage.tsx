import type React from 'react';
import { mockPost } from '../assets/mockPost';
import NoteCard from '../components/NoteCard';

const HomePage: React.FC = () => {
  const handleUpdateNote = (id: string) => {
    console.log(id);
  };

  const hanleViewNote = (id: string) => {
    console.log(id);
  };

  const handleDeleteNote = (id: string) => {
    console.log(id);
  };

  return (
    <div>
      {/* Tiêu đề */}
      <div>Danh sách các ghi chú</div>

      {/* Danh sách ghi chú */}
      <div>
        {mockPost.map(item => {
          return (
            <NoteCard
              {...item}
              key={item.id}
              viewNote={() => hanleViewNote(item.id)}
              deleteNote={() => handleDeleteNote(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
