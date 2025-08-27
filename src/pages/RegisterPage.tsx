import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  Grid,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  FacebookOutlined,
  Person,
  Lock,
  CalendarToday,
  PeopleAltOutlined,
  Email,
  Phone,
  HowToReg,
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
  fullName: string;
  dob: Date;
  email: string;
  gender: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const gender = [
    {
      value: 'male',
      label: 'Nam',
    },
    {
      value: 'female',
      label: 'Nữ',
    },
    {
      value: 'other',
      label: 'Khác',
    },
  ];

  const formData = yup.object({
    fullName: yup
      .string()
      .required('Họ tên là bắt buộc')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .matches(
        /^[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{0,48}[A-Za-zÀ-ỹ]$/,
        'Họ tên không hợp lệ'
      )
      .trim(),

    dob: yup
      .date()
      .required('Ngày sinh là bắt buộc')
      .typeError('Ngày sinh không hợp lệ')
      .max(new Date(), 'Ngày sinh không hợp lệ'),

    gender: yup
      .string()
      .required('Vui lòng chọn giới tính')
      .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),

    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không hợp lệ'),

    phone: yup
      .string()
      .required('Số điện thoại là bắt buộc')
      .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, 'Số điện thoại không hợp lệ'),

    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
      ),
    confirmPassword: yup
      .string()
      .required('Vui lòng nhập lại mật khẩu')
      .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
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
      fullName: '',
      email: '',
      gender: '',
      dob: new Date(),
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();
      const response = await register(data);

      if (response?.success) {
        dispatch(
          openSnackbar({
            message: 'Đăng ký thành công!',
            severity: 'success',
          })
        );
        navigate('/login');
      } else {
        switch (response?.errorCode) {
          case 'USER_EXIST':
            setError('phone', {
              type: 'value',
              message: response.message,
            });
            dispatch(
              openSnackbar({
                severity: 'error',
                message: response.message || '',
              })
            );
            break;

          default:
            dispatch(
              openSnackbar({
                severity: 'error',
                message: 'Đăng ký tài khoản thất bại',
              })
            );
            break;
        }
      }
    } catch (error) {
      console.error('Register error:', error);

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
        className='w-full max-w-2xl p-8'
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
            Đăng ký
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Đăng ký tài khoản để sử dụng NoteApp!
          </Typography>
        </Box>

        {/* Form */}
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-center',
              marginTop: 4,
            }}
          >
            {/* Họ tên */}
            <Grid size={{ xs: 12, md: 12 }}>
              <Controller
                control={control}
                name='fullName'
                render={({ field, fieldState }) => (
                  <div>
                    <TextField
                      {...field}
                      type='text'
                      placeholder='Nhập họ và tên của bạn'
                      label='Họ và tên'
                      className='w-full'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Person className='mr-1 text-gray-400' />
                          ),
                        },
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                    />
                  </div>
                )}
              />
            </Grid>

            {/* Số điện thoại */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name='phone'
                render={({ field, fieldState }) => (
                  <div>
                    <TextField
                      {...field}
                      type='tel'
                      placeholder='Nhập số điện thoại của bạn'
                      label='Số điện thoại'
                      className='w-full'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Phone className='mr-1 text-gray-400' />
                          ),
                        },
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                    />
                  </div>
                )}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name='email'
                render={({ field, fieldState }) => (
                  <div>
                    <TextField
                      {...field}
                      type='email'
                      placeholder='Nhập email của bạn'
                      label='Email'
                      className='w-full'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Email className='mr-1 text-gray-400' />
                          ),
                        },
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                    />
                  </div>
                )}
              />
            </Grid>

            {/* Giới tính */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name='gender'
                render={({ field, fieldState }) => (
                  <div>
                    <TextField
                      {...field}
                      select
                      placeholder='Chọn giới tính của bạn'
                      label='Giới tính'
                      className='!w-full'
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <PeopleAltOutlined className='mr-1 text-gray-400' />
                          ),
                        },
                      }}
                    >
                      {gender.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name='dob'
                render={({ field, fieldState }) => (
                  <div>
                    <TextField
                      {...field}
                      type='date'
                      placeholder='Nhập ngày sinh của bạn'
                      label='Ngày sinh'
                      className='w-full'
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split('T')[0]
                          : field.value
                      }
                      onChange={e => field.onChange(new Date(e.target.value))}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <CalendarToday className='mr-1 text-gray-400' />
                          ),
                        },
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                    />
                  </div>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
                          startAdornment: (
                            <Lock className='mr-1 text-gray-400' />
                          ),
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-2'>
                    <TextField
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Nhập lại mật khẩu của bạn'
                      className='rounded-md border pl-2'
                      label='Nhập lại mật khẩu'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Lock className='mr-1 text-gray-400' />
                          ),
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
                      helperText={fieldState?.error?.message || ''}
                    />
                  </div>
                )}
              />
            </Grid>
          </Grid>

          {/* Nút lưu khi đang chỉnh sửa */}
          <Box className='mt-6 flex w-full justify-center'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
              startIcon={<HowToReg />}
              className='w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 hover:from-green-700 hover:to-emerald-700 sm:!mx-30'
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : 'Đăng ký'}
            </Button>
          </Box>
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
            Đăng ký với Google
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
            Đăng ký với Facebook
          </Button>
        </Box>

        {/* Register Link */}
        <Box className='mt-2 text-center'>
          <Typography variant='body2' color='textSecondary'>
            Đã có tài khoản?{' '}
            <Link
              to='/login'
              className='font-medium text-blue-600 transition-colors hover:text-blue-800'
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
