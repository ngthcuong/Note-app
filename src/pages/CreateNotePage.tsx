import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { mockPost } from '../assets/mockPost';
import type { Note } from '../interfaces/Note';
import { useNavigate } from 'react-router-dom';

interface FormData {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CreateNotePage = () => {
  const navigate = useNavigate();

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

    mockPost.push({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    control._reset({
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    alert('Tạo một ghi chú mới thành công!');
    navigate('/');
  };

  return (
    <div className='mt-24 flex min-h-screen flex-col items-center'>
      <div className='text-center text-4xl'>Tạo ghi chú mới</div>

      {/* Form tạo ghi chú */}
      <div className='mt-4 w-3xl rounded-2xl border p-4'>
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
        <div className='mt-2 flex justify-evenly gap-2'>
          <button
            className='grow-1 cursor-pointer rounded-sm bg-green-600 p-2 font-semibold text-white'
            type='button'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu' : 'Lưu'}
          </button>
          <button
            className='grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white'
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
