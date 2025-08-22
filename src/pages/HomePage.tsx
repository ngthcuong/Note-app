import { mockPost } from '../assets/mockPost';
import Note from '../components/Note';

const HomePage = () => {
  return (
    <div>
      {/* Tiêu đề */}
      <div>Danh sách các ghi chú</div>

      {/* Danh sách ghi chú */}
      <div>
        {mockPost.map(item => {
          return <Note {...item} />;
        })}
      </div>
    </div>
  );
};

export default HomePage;
