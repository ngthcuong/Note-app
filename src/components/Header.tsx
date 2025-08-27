import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Logout, Person, PersonPinCircleOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

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
    '/profile': {
      label: 'Thông tin người dùng',
      icon: <Person sx={{ mr: 0.5 }} fontSize='inherit' />,
    },
    '/login': { label: 'Đăng nhập' },
    '/register': { label: 'Đăng ký' },
  };

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Tạo breadcrumb items dựa trên current path
  const generateBreadcrumbs = () => {
    // Chuyển url thành mảng dựa trên các '/'
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];

    // Luôn có Home
    breadcrumbs.push({
      path: '/',
      label: 'Trang chủ',
      icon: <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />,
      isActive: location.pathname === '/', // Kiểm tra nếu đang ở Home
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

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  const menuSetting = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => navigate('/profile')}>
        <PersonPinCircleOutlined sx={{ mr: 1 }} />
        Thông tin cá nhân
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          navigate('/login', { replace: true });
        }}
      >
        <Logout sx={{ mr: 1 }} />
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  return (
    <div className='mx-auto mb-2 flex max-w-7xl items-center justify-between rounded-2xl border px-4'>
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
        <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
          <Avatar />
        </IconButton>
        {menuSetting}
      </div>
    </div>
  );
}
