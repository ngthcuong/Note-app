import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, IconButton } from '@mui/material';

// Định nghĩa mapping cho các routes
const routeMapping: Record<string, { label: string; icon?: React.ReactNode }> =
  {
    '/': {
      label: 'Trang chủ',
      icon: <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
    },
    '/create-note': {
      label: 'Tạo ghi chú mới',
      icon: <CreateIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
    },
    '/notes': {
      label: 'Chỉnh sửa ghi chú',
      icon: <EditIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
    },
    '/login': { label: 'Đăng nhập' },
    '/register': { label: 'Đăng ký' },
  };

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tạo breadcrumb items dựa trên current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];

    // Luôn có Home
    breadcrumbs.push({
      path: '/',
      label: 'Trang chủ',
      icon: <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
      isActive: location.pathname === '/',
    });

    // Thêm các path con
    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;

      if (pathname === 'notes' && pathnames[index + 1]) {
        breadcrumbs.push({
          path: currentPath,
          label: 'Chi tiết ghi chú',
          icon: <EditIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
          isActive: false,
        });
        return;
      }

      const mappedRoute = routeMapping[currentPath];
      if (mappedRoute) {
        breadcrumbs.push({
          path: currentPath,
          ...mappedRoute,
          isActive: location.pathname === currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  console.log(breadcrumbs);

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className='mb-8 flex w-full items-center justify-between'>
      <div>
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return isLast ? (
              <Typography
                key={breadcrumb.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Typography>
            ) : (
              <Link
                key={breadcrumb.path}
                underline='hover'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
                color='inherit'
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>

      <div>
        <IconButton onClick={() => alert('Profile menu')}>
          <Avatar />
        </IconButton>
      </div>
    </div>
  );
}
