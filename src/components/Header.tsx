import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar, IconButton } from '@mui/material';

export default function Header() {
  return (
    <div className='mb-8 flex w-full items-center justify-between'>
      <div>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link
            underline='hover'
            sx={{ display: 'flex', alignItems: 'center', fontSize: 24 }}
            color='inherit'
            href='/'
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />
            Trang chủ
          </Link>
          <Link
            underline='hover'
            sx={{ display: 'flex', alignItems: 'center', fontSize: 24 }}
            color='inherit'
            href='/create-note'
          >
            Tạo ghi chú mới
          </Link>
        </Breadcrumbs>
      </div>

      <div>
        <IconButton onClick={() => alert('a')}>
          <Avatar />
        </IconButton>
      </div>
    </div>
  );
}
