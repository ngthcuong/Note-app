import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import Header from '../components/Header';

interface FormData {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ViewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { deleteNote, updateNote, getNoteById } = useNotes();

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
    if (!id) {
      alert('ID ghi chú không hợp lệ');
      navigate('/');
      return;
    }

    const note = getNoteById(id!);
    if (note) {
      reset({
        title: note?.title,
        content: note?.content,
        createdAt: note?.createdAt,
        updatedAt: note?.updatedAt,
      });
    }
  }, [id, reset, getNoteById]);

  const onSubmit = (formData: FormData) => {
    if (!id) return;

    updateNote(id, formData);

    reset({
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    alert('Cập nhật ghi chú thành công!');
    navigate('/');
  };

  const handleDeleteNote = (id: string) => {
    if (!id) return;
    deleteNote(id);
    alert('Xóa ghi chú thành công');
    navigate('/');
  };

  return (
    <div className='mx-auto mt-12 flex min-h-screen w-full max-w-sm flex-col items-center px-4 sm:max-w-md sm:px-6 md:mt-16 md:max-w-lg md:px-8 lg:mt-24 lg:max-w-2xl lg:px-0'>
      <Header title='Chỉnh sửa ghi chú' />
      {/* <div className='text-center text-2xl font-semibold sm:text-4xl'>
        Chỉnh sửa ghi chú
      </div> */}

      {/* Form tạo ghi chú */}
      <div className='mt-4 w-full rounded-2xl border p-4 shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl'>
        {/* Tiêu đề */}
        <div>
          <Controller
            control={control}
            name='title'
            render={({ field, fieldState }) => {
              return (
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
              );
            }}
          />
        </div>

        {/* Nội dung */}
        <div className='mt-2'>
          <Controller
            control={control}
            name='content'
            render={({ field, fieldState }) => {
              return (
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
              );
            }}
          />
        </div>

        {/* Các nút action */}
        <div className='mt-2 flex flex-col justify-evenly gap-2 text-center sm:flex-row'>
          <button
            className='h-8 grow-1 cursor-pointer rounded-sm bg-green-600 p-2 font-semibold text-white sm:h-10'
            type='button'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang cập nhật' : 'Cập nhật'}
          </button>
          <button
            className='h-8 grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white sm:h-10'
            type='button'
            onClick={() => handleDeleteNote(id || '')}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotePage;
