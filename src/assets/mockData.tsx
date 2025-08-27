import type { Note } from '../interfaces/Note';
import type User from '../interfaces/User';

export const mockPost: Note[] = [
  {
    id: '1',
    title: 'Học React Hooks',
    content:
      'useState và useEffect là hai hooks cơ bản nhất cần nắm vững. useState dùng để quản lý state, useEffect để handle side effects.',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-15'),
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    content:
      'Luôn định nghĩa kiểu dữ liệu rõ ràng, tránh dùng any. Sử dụng interface thay vì type alias khi có thể. Tận dụng các utility types có sẵn.',
    createdAt: new Date('2023-08-16'),
    updatedAt: new Date('2023-08-17'),
  },
  {
    id: '3',
    title: 'Tối ưu Performance React',
    content:
      'Sử dụng React.memo để tránh re-render không cần thiết. Đặt các hàm callback trong useCallback. Cached data với useMemo khi cần.',
    createdAt: new Date('2023-08-18'),
    updatedAt: new Date('2023-08-19'),
  },
  {
    id: '4',
    title: 'CSS Flexbox và Grid',
    content:
      'Flexbox phù hợp cho layout 1 chiều, Grid tốt hơn cho layout 2 chiều. Kết hợp cả hai để tạo layout linh hoạt và responsive.',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-08-20'),
  },
  {
    id: '5',
    title: 'Git Workflow',
    content:
      'Tạo branch riêng cho mỗi feature. Commit thường xuyên với message rõ ràng. Rebase thay vì merge để giữ git history sạch sẽ.',
    createdAt: new Date('2023-08-21'),
    updatedAt: new Date('2023-08-22'),
  },
  {
    id: '6',
    title: 'Testing với Jest',
    content:
      'Viết test cho các component quan trọng. Mock các external dependencies. Coverage nên đạt ít nhất 80%. Test các edge cases.',
    createdAt: new Date('2023-08-23'),
    updatedAt: new Date('2023-08-24'),
  },
  {
    id: '7',
    title: 'State Management',
    content:
      'Context API đủ dùng cho ứng dụng nhỏ. Redux phù hợp cho ứng dụng lớn. Zustand là lựa chọn tốt ở middle ground.',
    createdAt: new Date('2023-08-25'),
    updatedAt: new Date('2023-08-25'),
  },
  {
    id: '8',
    title: 'Responsive Design',
    content:
      'Sử dụng CSS Media Queries. Mobile First Approach. Tailwind CSS giúp làm responsive dễ dàng hơn với các utility classes.',
    createdAt: new Date('2023-08-26'),
    updatedAt: new Date('2023-08-27'),
  },
  {
    id: '9',
    title: 'API Integration',
    content:
      'Sử dụng Axios hoặc Fetch API. Implement error handling. Cached API calls với React Query. Handle loading và error states.',
    createdAt: new Date('2023-08-28'),
    updatedAt: new Date('2023-08-28'),
  },
  {
    id: '10',
    title: 'API Integration',
    content:
      'Sử dụng Axios hoặc Fetch API. Implement error handling. Cached API calls với React Query. Handle loading và error states.',
    createdAt: new Date('2023-08-28'),
    updatedAt: new Date('2023-08-28'),
  },
];

export const mockUser: User[] = [
  {
    id: '1',
    phone: '0373472803',
    password: '123456a!A',
    fullName: 'Nguyen Thanh Cuong',
    dob: new Date('07-03-2003'),
    email: 'cuong.nguyent@s3corp.com.vn',
    gender: 'male',
  },
];
