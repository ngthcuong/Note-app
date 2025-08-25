import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Note } from '../interfaces/Note';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import Header from '../components/Header';
import { useAppDispatch } from '../hooks';
import { openSnackbar } from '../redux/slices/snackBarSlice';

interface FormData {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CreateNotePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { addNote } = useNotes();

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

  const onSubmit = (formData: FormData) => {
    const data: Note = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
    };

    addNote(data);

    dispatch(
      openSnackbar({
        message: 'Đã tạo mới ghi chú thành công',
      })
    );

    control._reset({
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    navigate('/');
  };

  return (
    <div className='mx-auto mt-12 flex min-h-screen w-full max-w-sm flex-col items-center px-4 sm:max-w-md sm:px-6 md:mt-16 md:max-w-lg md:px-8 lg:mt-24 lg:max-w-2xl lg:px-0'>
      <Header title={' Tạo ghi chú mới'} />
      {/* <div className='mt-8 text-center text-2xl font-semibold sm:text-4xl'></div> */}

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
            {isSubmitting ? 'Đang lưu' : 'Lưu'}
          </button>
          <button
            className='h-8 grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white sm:h-10'
            type='button'
            onClick={() => {
              control._reset({
                title: '',
                content: '',
              });
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotePage;
