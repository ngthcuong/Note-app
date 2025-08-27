import { Close, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface ModalChangePasswordProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirm = ({
  open,
  onClose,
  onConfirm,
}: ModalChangePasswordProps) => {
  const { confirmUser } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formSchema = yup.object({
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async ({ password }: { password: string }) => {
    try {
      const response = await confirmUser(password);

      if (response?.success) {
        reset();
        onConfirm();
        onClose();
      } else {
        switch (response?.errorCode) {
          case 'WRONG_PASSWORD':
            setError('password', {
              type: 'value',
              message: response.message,
            });

            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      className='rounded-lg'
    >
      <DialogTitle className='flex items-center justify-between bg-blue-50'>
        <Typography className='!text-2xl font-bold text-blue-700'>
          Xác thực người dùng
        </Typography>
        <IconButton onClick={onClose} size='small'>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className='mt-4'>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          className='mt-2 flex flex-col gap-4 space-y-3'
        >
          <Controller
            control={control}
            name='password'
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <TextField
                  {...field}
                  placeholder='Nhập mật khẩu của bạn'
                  className='rounded-md border pl-2'
                  type={showPassword ? 'text' : 'password'}
                  label='Mật khẩu'
                  slotProps={{
                    input: {
                      startAdornment: <Lock className='mr-1 text-gray-400' />,
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Visibility className='text-gray-500' />
                          ) : (
                            <VisibilityOff className='text-gray-500' />
                          )}
                        </IconButton>
                      ),
                    },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message || ''}
                />
              </div>
            )}
          />

          <DialogActions className='mt-4'>
            <Button
              onClick={onClose}
              variant='outlined'
              className='border-blue-600 text-blue-600 hover:bg-blue-50'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={isSubmitting}
              className='bg-blue-600 text-white hover:bg-blue-700'
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirm;
