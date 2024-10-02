import { useFormik } from 'formik';
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FeedDetails } from '../types/feedTypes/feedDetails';
import { validationSchema } from '../utils/feedValidation/FeedValidation';
import Swal from 'sweetalert2';
import api from '../components/API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFeed } from '../redux/feed/feedSlice';
import { RootState } from '../redux/store';
import { setLoading, setLoadingClose } from '../redux/student/studentSlice';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchFeeds: () => void;
}

interface PostData {
  title: string;
  content: string;
  files: File[];
}
const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, fetchFeeds }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.student.loading);
// Assuming you are in a file input change event handler



  const formik = useFormik<FeedDetails>({
    initialValues: {
      title: "",
      content: "",
      files: []
    },
    validationSchema,
    onSubmit: async (values: PostData) => {
      console.log('va', values);
      
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit the form?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      }).then(async (result) => {
        console.log('res',result)
        if (result.isDismissed) {
          return; 
        }
  
        dispatch(setLoading());
        Swal.fire({
          title: 'Submitting...',
          text: 'Please wait while we submit your Post.',
          icon: 'info',
          showCancelButton: false,
          showConfirmButton: false,
          allowOutsideClick: false, 
        });
  
        const formData = new FormData();
        for (const key in values) {
          if (key !== 'files') {
            const value = values[key as keyof FeedDetails];
            formData.append(key, String(value));
          }
        }
        values.files.forEach(file => formData.append('files', file));
  
        try {
          const response = await api.post('/backend/feed/feedPost', formData, {
            headers: {
              'X-Token-Type': 'student'
            }
          });
          dispatch(setCurrentFeed(response.data.data));
          fetchFeeds();
          
          Swal.fire('Success!', 'Your post has been submitted successfully.', 'success').then(() => {
            dispatch(setLoadingClose());
            onClose(); 
          });          
        } catch (error) {
          dispatch(setLoadingClose());
          console.log(error);
          Swal.fire('Error!', 'There was a problem submitting your post. Check your file format.(png,jpg or jpeg or mp4) are allowed', 'error').then(() => {
            dispatch(setLoadingClose());
          });          
        }
            });
    }
  });
  
  if (!isOpen) return null;
if(loading){
  return(
    <div className='m-auto flex justify-center items-center translate-x-50 translate-y-50'>
                <div className="border-t-4 border-blue-500 border-solid w-12 h-12 border-t-transparent rounded-full animate-spin"></div>

    </div>
  )
}

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black opacity-40' onClick={onClose}></div>

      {/* Modal Content */}
      <div className='relative bg-black p-8 mt-5 rounded-lg shadow-lg w-3/4 md:w-1/2'>
        {loading ? (
                <div className="border-t-4 border-blue-500 border-solid w-12 h-12 border-t-transparent rounded-full animate-spin"></div>

        ) : (
          <>
            <button
              className='absolute top-2 right-2 text-white text-xl'
              onClick={onClose}
            >
              <IoClose />
            </button>
            <h2 className='text-xl font-bold mb-4 text-white'>Add Post</h2>
            {/* Additional modal content here */}
            <form onSubmit={formik.handleSubmit}>
              <div className='mb-4'>
                <label className='block text-white'>Title</label>
                <input
                  name='title'
                  type='text'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='Enter title'
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className='text-red-500'>{formik.errors.title}</div>
                ) : null}
              </div>
              <div className='mb-4'>
                <label className='block text-white'>Content</label>
                <textarea
                  name='content'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.content}
                  className='w-full p-2 border border-gray-300 rounded'
                  rows={4} 
                  placeholder='Enter content'
                ></textarea>
                {formik.touched.content && formik.errors.content ? (
                  <div className='text-red-500'>{formik.errors.content}</div>
                ) : null}
              </div>
              <div className='mb-4'>
                <label className='block text-white'>Picture/Video</label>
                <input
                  name='files'
                  type='file'
               
  onChange={(event:React.ChangeEvent<HTMLInputElement> ) => {
    const files = event.currentTarget.files;

    if (files) {
      formik.setFieldValue('files', Array.from(files));
    } else {
      formik.setFieldValue('files', []);
    }
  }}
  onBlur={formik.handleBlur}
  multiple
  className='w-full p-2 border text-white border-gray-300 rounded'
/>
{formik.touched.files && formik.errors.files ? (
  <div className='text-red-500'>{formik.errors.files}</div>
) : null}

              </div>
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 text-white p-2 rounded'
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PostModal;
 