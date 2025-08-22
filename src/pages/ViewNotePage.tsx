import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { mockPost } from '../assets/mockPost';
import { useNavigate, useParams } from 'react-router-dom';
import type { Note } from '../interfaces/Note';

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
  const [notes, setNotes] = useState(mockPost);
  const [foundNote, setFoundNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!id) {
      alert('ID ghi chú không hợp lệ');
      navigate('/');
      return;
    }

    try {
      const note = notes.find(item => item.id === id);

      if (note) {
        setFoundNote(note);
        reset({
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        });
      } else {
        alert('Ghi chú không tồn tại');
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

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

  const onSubmit = (formData: FormData) => {
    if (!id || !foundNote) return;

    const noteIndex = notes.findIndex(item => item.id === id);
    console.log(noteIndex);

    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...formData,
        id: id ?? '',
        updatedAt: new Date(),
      };
      setNotes([...notes]);

      control._reset({
        title: '',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert('Cập nhật ghi chú thành công!');
      navigate('/');
    } else {
      alert('Không tìm thấy ghi chú!');
    }
  };

  const handleDeleteNote = (id: string) => {
    if (!id) return;

    const noteIndex = mockPost.findIndex(item => item.id === id);
    if (noteIndex !== -1) {
      mockPost.splice(noteIndex, 1);
      alert('Xóa ghi chú thành công');
      navigate('/');
    } else {
      alert('Không tìm thấy ghi chú');
    }
  };

  return (
    <div className='mt-24 flex min-h-screen flex-col items-center'>
      <div className='text-center text-4xl'>Chỉnh sửa ghi chú</div>

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
            {isSubmitting ? 'Đang cập nhật' : 'Cập nhật'}
          </button>
          <button
            className='grow-1 cursor-pointer rounded-sm bg-red-500 font-semibold text-white'
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
