import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EditTutor } from '../../types/modalTypes/EditModat';
import { IoIosCloseCircle } from 'react-icons/io';
import Swal from 'sweetalert2';
import api from '../../components/API/Api';
import { updateFiles } from '../../redux/tutor/tutorSlice';
import { useDispatch } from 'react-redux';

interface FormValues {
  files: File[];
}

const AddFileModal: React.FC<EditTutor> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const formik = useFormik<FormValues>({
    initialValues: {
      files: [] as File[],
    },
    validationSchema: Yup.object({
      files: Yup.array()
        .of(
          Yup.mixed<File>().test(
            'file',
            'Images and PDFs are allowed',
            (file: File | undefined) => {
              if (!file) return false;
              return /\.(jpeg|jpg|gif|png|pdf|webp)$/i.test(file.name);
            }
          )
        )
        .min(1, 'Please upload at least one file')
        .required('Please upload at least one file'),
    }),
    onSubmit: async (values) => {
      console.log('Files to be uploaded:', values.files);

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add the Files?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          values.files.forEach((file) => {
            formData.append('files', file, file.name);
          });

          try {
            const response = await api.post('/backend/tutor/updateFiles', formData, {
              headers: {
                'X-Token-Type': 'tutor'
              }
            });
            dispatch(updateFiles(response.data.rest));
            onClose();
          } catch (error) {
            console.error('Error uploading files:', error);
          }
        }
      });
    },
  });

  const handleClose = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const updatedFiles = formik.values.files.filter((_, i) => i !== index);
    formik.setFieldValue('files', updatedFiles);
  };

  useEffect(() => {
    const objectUrls = formik.values.files.map((file) => URL.createObjectURL(file));

    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [formik.values.files]);

  if (!isOpen) return null;

  return (
    <div className='inset-0 fixed justify-center flex items-center bg-black bg-opacity-50'>
      <div className='bg-custom-gradient w-[80%] h-[90vh] rounded-lg shadow-lg p-8'>
        <h1 className='text-2xl text-white mb-6'>Add File</h1>
        <div className='flex justify-center items-center'>
          <form onSubmit={formik.handleSubmit} className='w-full'>
            <input
              ref={fileInputRef}
              className='bg-white w-full p-4 rounded-lg'
              type='file'
              name='files'
              onChange={(event) => {
                const files = event.target.files;
                if (files) {
                  const updatedFiles = [...formik.values.files, ...Array.from(files)];
                  formik.setFieldValue('files', updatedFiles);
                }
              }}
              multiple
            />

            {/* Error Handling */}
            {formik.errors.files && formik.touched.files ? (
              <div className='text-red-500 mt-2'>
                {/* Check if errors.files is an array or string */}
                {Array.isArray(formik.errors.files)
                  ? formik.errors.files.map((error, index) => (
<div key={index}>{error as string}</div>                    ))
                  : <div>{formik.errors.files}</div>}
              </div>
            ) : null}

            <div className='mt-4 flex gap-4 p-4 rounded-lg shadow-inner max-w-full overflow-auto'>
              {formik.values.files.map((file, index) => (
                <div key={index} className='relative mb-2'>
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded preview ${index + 1}`}
                      className='w-32 h-20 object-cover rounded-lg'
                    />
                  ) : (
                    <object
                      data={URL.createObjectURL(file)}
                      type='application/pdf'
                      width='128'
                      height='80'
                      className='relative rounded-lg border border-gray-300'
                      style={{ overflow: 'auto', backgroundColor: '#f5f5f5' }}
                    >
                      <p className='text-gray-700 text-sm'>PDF Preview Unavailable</p>
                    </object>
                  )}
                  <p className='absolute font-extrabold text-red-700 rounded-2xl'>
                    {file.type === 'application/pdf' ? 'PDF' : ''}
                  </p>

                  <div className='absolute top-0 right-0 text-2xl'>
                    <button type='button' onClick={(e) => handleClose(index, e)}>
                      <IoIosCloseCircle className='text-red-900' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg mt-4'
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
