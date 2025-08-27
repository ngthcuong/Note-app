import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAppDispatch } from '../hooks';
import {
  Edit,
  Email,
  Person,
  Phone,
  Lock,
  CalendarToday,
  PeopleAltOutlined,
} from '@mui/icons-material';
import ModalChangePassword from '../components/ModalChangePassword';
import { openSnackbar } from '../redux/slices/snackBarSlice';
import { useAuth } from '../contexts/AuthContext';
import ModalConfirm from '../components/ModalConfirm';

interface FormData {
  id?: string;
  phone: string;
  fullName: string;
  dob: Date;
  email: string;
  gender: string;
}

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

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, updateUser } = useAuth();

  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<FormData | null>(null);

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
  });

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(formData),
    defaultValues: {
      phone: user?.phone || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      gender: user?.gender || '',
      dob: user?.dob || new Date(),
    },
  });

  const onCancel = () => {
    clearErrors();
    reset();
    setIsEditing(false);
  };

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     const response = await updateUser(data);

  //     if (response?.success) {
  //       setIsEditing(false);
  //       dispatch(openSnackbar({ message: 'Cập nhật thông tin thành công' }));
  //     } else {
  //       dispatch(
  //         openSnackbar({ message: response?.message || '', severity: 'error' })
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     dispatch(openSnackbar({ message: 'Cập nhật thông tin thất bại' }));
  //   }
  // };

  const onSubmit = async (data: FormData) => {
    try {
      setUpdateData(data);
      setIsShowModalConfirm(true);
    } catch (error) {
      console.error(error);
      dispatch(
        openSnackbar({
          message: 'Có lỗi xảy ra',
          severity: 'error',
        })
      );
    }
  };

  const handleConfirmSuccess = async () => {
    try {
      if (!updateData) {
        dispatch(
          openSnackbar({
            message: 'Không có dữ liệu để cập nhật',
            severity: 'error',
          })
        );
        return;
      }

      const response = await updateUser(updateData);

      if (response?.success) {
        setIsEditing(false);
        setIsShowModalConfirm(false);
        setUpdateData(null);

        dispatch(
          openSnackbar({
            message: 'Cập nhật thông tin thành công',
            severity: 'success',
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: response?.message || 'Cập nhật thông tin thất bại',
            severity: 'error',
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        openSnackbar({
          message: 'Cập nhật thông tin thất bại',
          severity: 'error',
        })
      );
    }
  };

  return (
    <Paper elevation={8} className='m-auto max-w-7xl p-8'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Các button */}
        <Box
          sx={{
            alignSelf: 'flex-start',
          }}
        >
          <Button
            variant='contained'
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 py-3 hover:from-blue-700 hover:to-indigo-700'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              marginRight: 2,
            }}
          >
            Cập nhật thông tin
          </Button>
          <Button
            variant='outlined'
            startIcon={<Lock />}
            className='from-blue-600 to-indigo-600 py-3 hover:from-blue-700 hover:to-indigo-700'
            onClick={() => setIsShowModal(!isShowModal)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {/* Thông tin của người dùng */}
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
                      disabled={!isEditing}
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
                      disabled={true}
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
                      disabled={!isEditing}
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
                      placeholder='Nhập giới tính của bạn'
                      label='Giới tính'
                      className='w-full'
                      disabled={!isEditing}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message || ''}
                      value={field.value}
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
                      disabled={!isEditing}
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
          </Grid>

          {/* Nút lưu khi đang chỉnh sửa */}
          {isEditing && (
            <div className='mt-6 flex gap-3 self-end'>
              <Button
                variant='outlined'
                type='button'
                onClick={() => onCancel()}
                className='normal-case'
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 400,
                }}
              >
                Hủy
              </Button>
              <Button
                variant='contained'
                type='submit'
                disabled={isSubmitting}
                // onClick={() => handleSubmit(onSubmit)}
                className='bg-gradient-to-r from-green-600 to-emerald-600 py-3 hover:from-green-700 hover:to-emerald-700'
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {isSubmitting ? <CircularProgress size={20} /> : 'Lưu'}
              </Button>
            </div>
          )}
        </Box>
      </Box>

      {isShowModal && (
        <ModalChangePassword
          open={isShowModal}
          onClose={() => setIsShowModal(!isShowModal)}
        />
      )}

      {isShowModalConfirm && (
        <ModalConfirm
          open={isShowModalConfirm}
          onClose={() => setIsShowModalConfirm(!isShowModalConfirm)}
          onConfirm={handleConfirmSuccess}
        />
      )}
    </Paper>
  );
};

export default UserPage;
