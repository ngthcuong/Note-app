import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import Header from './Header';
import { useAppDispatch } from '../hooks';
import { openSnackbar } from '../redux/slices/snackBarSlice';
import type { Note } from '../interfaces/Note';
import { Typography } from '@mui/material';

interface FormData {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteFormProps {
  mode: 'create' | 'edit';
  noteId?: string;
  onDelete?: (id: string) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ mode, noteId, onDelete }) => {
  const navigate = useNavigate();
  const { addNote, updateNote, getNoteById } = useNotes();
  const dispatch = useAppDispatch();

  const formSchema = yup.object({
    title: yup
      .string()
      .min(1, 'Tiêu đề không được để trống')
      .max(100, 'Tiêu đề không được quá 100 ký tự')
      .required('Tiêu đề là bắt buộc'),
    content: yup
      .string()
      .min(1, 'Nội dung không được để trống')
      .required('Nội dung là bắt buộc'),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  useEffect(() => {
    if (mode === 'edit' && noteId) {
      const note = getNoteById(noteId);
      if (note) {
        reset({
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        });
      }
    }
  }, [mode, noteId, reset, getNoteById]);

  const onSubmit = (formData: FormData) => {
    if (mode === 'create') {
      const data: Note = {
        ...formData,
        id: crypto.randomUUID(),
      };
      addNote(data);
      dispatch(openSnackbar({ message: 'Đã tạo mới ghi chú thành công' }));
    } else if (mode === 'edit' && noteId) {
      updateNote(noteId, formData);
      dispatch(openSnackbar({ message: 'Đã cập nhật ghi chú thành công' }));
    }

    reset({
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    navigate('/');
  };

  const handleCancel = () => {
    if (mode === 'create') {
      reset({ title: '', content: '' });
    }
  };

  return (
    <div className='mx-auto mt-8 flex w-full max-w-sm flex-col items-center px-4 sm:max-w-md sm:px-6 md:mt-16 md:max-w-lg md:px-8 lg:mt-24 lg:max-w-2xl lg:px-0'>
      <Header />

      <Typography
        variant='h4'
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          flex: 1,
        }}
      >
        {mode === 'create' ? 'Tạo ghi chú mới' : 'Chỉnh sửa ghi chú'}
      </Typography>

      <div className='mt-4 w-full rounded-2xl border p-4 shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl'>
        <div>
          <Controller
            control={control}
            name='title'
            render={({ field, fieldState }) => (
              <div>
                <input
                  {...field}
                  type='text'
                  placeholder='Tiêu đề'
                  className='w-full rounded-lg border p-2'
                />
                {fieldState.error && (
                  <p className='text-sm text-red-500'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className='mt-2'>
          <Controller
            control={control}
            name='content'
            render={({ field, fieldState }) => (
              <div>
                <textarea
                  {...field}
                  placeholder='Nội dung'
                  rows={10}
                  className='w-full rounded-lg border px-2'
                />
                {fieldState.error && (
                  <p className='text-sm text-red-500'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className='mt-2 flex flex-col justify-evenly gap-2 text-center sm:flex-row'>
          <button
            className='h-8 grow-1 cursor-pointer rounded-sm bg-green-600 p-2 font-semibold text-white sm:h-10'
            type='button'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Đang lưu'
                : 'Đang cập nhật'
              : mode === 'create'
                ? 'Lưu'
                : 'Cập nhật'}
          </button>

          {mode === 'create' ? (
            <button
              className='h-8 grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white sm:h-10'
              type='button'
              onClick={handleCancel}
            >
              Hủy
            </button>
          ) : (
            <button
              className='h-8 grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white sm:h-10'
              type='button'
              onClick={() => onDelete?.(noteId || '')}
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
