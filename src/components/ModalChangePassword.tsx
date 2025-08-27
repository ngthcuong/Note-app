import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { Lock, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch } from '../hooks';
import { openSnackbar } from '../redux/slices/snackBarSlice';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ModalChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

const ModalChangePassword = ({ open, onClose }: ModalChangePasswordProps) => {
  const { changePassword } = useAuth();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = yup.object({
    currentPassword: yup.string().required('Vui lòng nhập mật khẩu cũ'),
    newPassword: yup
      .string()
      .required('Mật khẩu mới là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
      ),
    confirmNewPassword: yup
      .string()
      .required('Vui lòng nhập lại mật khẩu mới')
      .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp'),
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
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await changePassword(
        data.currentPassword,
        data.newPassword
      );
      if (response?.success) {
        dispatch(openSnackbar({ message: response.message || '' }));
        reset();
        onClose();
      } else {
        switch (response?.errorCode) {
          case 'WRONG_PASSWORD':
            setError('currentPassword', {
              type: 'value',
              message: response.message,
            });
            dispatch(
              openSnackbar({
                message: response.message || '',
                severity: 'error',
              })
            );
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      dispatch(
        openSnackbar({
          message: 'Lỗi kết nối. Vui lòng thử lại.',
          severity: 'error',
        })
      );
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
          Thay đổi mật khẩu
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
            name='currentPassword'
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <TextField
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu của bạn'
                  className='rounded-md border pl-2'
                  label='Mật khẩu'
                  slotProps={{
                    input: {
                      startAdornment: <Lock className='mr-1 text-gray-400' />,
                    },
                  }}
                  error={!!fieldState.error}
                />
                {fieldState.error && (
                  <Typography variant='caption' color='error'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name='newPassword'
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <TextField
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu của bạn'
                  className='rounded-md border pl-2'
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
                />
                {fieldState.error && (
                  <Typography variant='caption' color='error'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name='confirmNewPassword'
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <TextField
                  {...field}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu của bạn'
                  className='rounded-md border pl-2'
                  label='Mật khẩu'
                  slotProps={{
                    input: {
                      startAdornment: <Lock className='mr-1 text-gray-400' />,
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <Visibility className='text-gray-500' />
                          ) : (
                            <VisibilityOff className='text-gray-500' />
                          )}
                        </IconButton>
                      ),
                    },
                  }}
                  error={!!fieldState.error}
                />
                {fieldState.error && (
                  <Typography variant='caption' color='error'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </div>
            )}
          />
          {/* Yêu cầu mật khẩu*/}
          <Box className='mt-4 rounded-lg bg-blue-50 p-4'>
            <Typography
              variant='body2'
              className='mb-2 font-semibold text-blue-700'
            >
              Yêu cầu mật khẩu:
            </Typography>
            <Typography
              variant='body2'
              component='li'
              className='text-gray-600'
            >
              Ít nhất 8 ký tự
            </Typography>
            <Typography
              variant='body2'
              component='li'
              className='text-gray-600'
            >
              Chứa chữ hoa và chữ thường
            </Typography>
            <Typography
              variant='body2'
              component='li'
              className='text-gray-600'
            >
              Chứa ít nhất 1 số
            </Typography>
            <Typography
              variant='body2'
              component='li'
              className='text-gray-600'
            >
              Chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
            </Typography>
          </Box>
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

export default ModalChangePassword;
