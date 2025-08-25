import { Alert, Snackbar, type SnackbarCloseReason } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { closeSnackbar } from '../redux/slices/snackBarSlice';

const SnackBar: React.FC = () => {
  const { isOpen, message, severity } = useAppSelector(state => state.snackbar);
  const dispatch = useAppDispatch();

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{}}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
