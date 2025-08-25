import { Button, Typography } from '@mui/material';
import React from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className='flex w-full items-center'>
      <Button
        sx={{
          textTransform: 'none',
          color: 'black',
          fontSize: 18,
        }}
        startIcon={<KeyboardBackspaceIcon />}
        onClick={goBack}
      >
        Quay lại
      </Button>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          flex: 1,
        }}
      >
        {title}
      </Typography>
    </div>
  );
};

export default Header;
