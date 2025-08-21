import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { mockPost } from '../assets/mockPost';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface FormData {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
}

const CreateNotePage = () => {
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
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      createdAt: new Date(),
    },
  });

  const onSubmit = (formData: FormData) => {
    const data: Note = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
    };

    mockPost.push({
      ...data,
      createdAt: data.createdAt.toISOString(),
    });
    console.log(data);
    console.log(mockPost);
  };

  return (
    <div className='w-3xl border p-4'>
      {/* Tiêu đề */}
      <div className='border'>
        <Controller
          name='title'
          render={({ field, fieldState }) => {
            return (
              <div>
                <input
                  {...field}
                  type='text'
                  placeholder='Tiêu đề'
                  className='w-full'
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
      <div className='mt-2 border'>
        <Controller
          name='content'
          render={({ field, fieldState }) => {
            return (
              <div>
                <textarea
                  {...field}
                  placeholder='Nội dung'
                  rows={5}
                  className='w-full'
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

      {/* Các nút  */}
      <div className='mt-2 flex justify-evenly gap-2'>
        <button
          className='grow-1 cursor-pointer rounded-sm bg-gray-500 p-2'
          type='button'
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưus'}
        </button>
        <button className='grow-1 cursor-pointer rounded-sm bg-amber-500'>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default CreateNotePage;
