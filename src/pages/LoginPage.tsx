import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login,
  Google,
  FacebookOutlined,
  Person,
  Lock,
} from '@mui/icons-material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch } from '../hooks';
import { openSnackbar } from '../redux/slices/snackBarSlice';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  id?: string;
  phone: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const formData = yup.object({
    phone: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
      .required('Số điện thoại là bắt buộc'),
    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
      ),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(formData),
    defaultValues: {
      phone: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();

      const response = await login(data);

      if (response?.success) {
        navigate('/');
      } else {
        switch (response?.errorCode) {
          case 'USER_NOT_FOUND':
            setError('phone', {
              type: 'value',
              message: response.message,
            });
            break;
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
      console.error('Login error:', error);

      dispatch(
        openSnackbar({
          message: 'Lỗi kết nối. Vui lòng thử lại.',
          severity: 'error',
        })
      );
    }
  };

  return (
    <Box className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8'>
      <Paper
        elevation={8}
        className='w-full max-w-md p-8'
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header */}
        <Box className='mb-8 space-y-2 text-center'>
          <Typography
            variant='h4'
            component='h1'
            className='font-bold text-gray-900'
          >
            Đăng nhập
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Chào mừng bạn quay trở lại với NoteApp!
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-3'
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Phone Field */}
            <Controller
              control={control}
              name='phone'
              render={({ field, fieldState }) => (
                <div className='flex flex-col gap-2'>
                  <TextField
                    {...field}
                    type='tel'
                    placeholder='Nhập số điện thoại của bạn'
                    className='rounded-md border pl-2'
                    label='Số điện thoại'
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Person className='mr-1 text-gray-400' />
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

            {/* Password Field */}
            <Controller
              control={control}
              name='password'
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
          </Box>

          {/* Remember Me & Forgot Password */}
          <Box className='flex items-center justify-between'>
            <FormControlLabel
              control={
                <Checkbox
                  name='rememberMe'
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  color='primary'
                />
              }
              label='Ghi nhớ đăng nhập'
            />
            <Link
              to='/forgot-password'
              className='text-sm text-blue-600 transition-colors hover:text-blue-800'
            >
              Quên mật khẩu?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            size='large'
            disabled={isSubmitting}
            startIcon={<Login />}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 py-3 hover:from-blue-700 hover:to-indigo-700'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Box>

        {/* Divider */}
        <Divider className='!my-1'>
          <Typography variant='body2' color='textSecondary'>
            hoặc
          </Typography>
        </Divider>

        {/* Social Login Buttons */}
        <Box className='space-y-5'>
          <Button
            fullWidth
            variant='outlined'
            size='large'
            className='hover:bg-gray-5 border-gray-300 text-gray-700'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#d1d5db',
              marginY: 2,
            }}
          >
            <Google className='mr-2' />
            Đăng nhập với Google
          </Button>

          <Button
            fullWidth
            variant='outlined'
            size='large'
            className='border-gray-300 text-gray-700 hover:bg-gray-50'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#d1d5db',
            }}
          >
            <FacebookOutlined className='mr-2' />
            Đăng nhập với Facebook
          </Button>
        </Box>

        {/* Register Link */}
        <Box className='mt-2 text-center'>
          <Typography variant='body2' color='textSecondary'>
            Chưa có tài khoản?{' '}
            <Link
              to='/register'
              className='font-medium text-blue-600 transition-colors hover:text-blue-800'
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
