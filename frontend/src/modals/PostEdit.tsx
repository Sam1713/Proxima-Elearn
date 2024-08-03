import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateSuccess } from '../redux/student/studentSlice';
import { RootState } from '../redux/store';
import { MoonLoader } from "react-spinners";
import { css } from '@emotion/react';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  showToast: (type: 'success' | 'error', message: string) => void;  // Callback for toast
}

const spinnerStyle = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PostEdit: React.FC<PostModalProps> = ({ isOpen, onClose, id, showToast }) => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      username: currentStudent?.username || '',  // Set default values
      email: currentStudent?.email || '',
      profilePic: undefined as File | undefined,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      profilePic: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      const token = localStorage.getItem('access_token');
      console.log('Fetched token:', token);
    
      setLoading(true);
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit the form?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formData = new FormData();
            // Append all values to FormData
            for (const key in values) {
              const value = values[key as keyof typeof values];
              if (value instanceof File) {
                formData.append(key, value);
              } else {
                formData.append(key, String(value));
              }
            }
            const response = await axios.put(
              `/backend/auth/updateStudentDetails/${id}`,
              formData,{
                withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`
  }
              }
              
              
            );
console.log('res',response)
            dispatch(updateSuccess(response.data.student));
            showToast('success', response.data.message);
            setLoading(false);
            onClose();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showToast('error', errorMessage);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    }
  });

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
          <MoonLoader
            color="#fff"
            loading={loading}
            css={spinnerStyle}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className='inset-0 bg-white bg-opacity-10 fixed flex justify-center items-center'>
          <div className='w-[90%] bg-black p-6 rounded-lg shadow-lg md:w-1/2'>
            <h2 className='text-2xl text-center font-semibold mb-4 text-white'>Edit Details</h2>
            <form onSubmit={formik.handleSubmit} className="flex flex-col my-5">
              <label className='flex flex-col text-white'>
                Username:
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  type="text"
                  name="username"
                  className='border text-black font-bold border-gray-300 p-2 rounded-md'
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500 text-sm">{formik.errors.username}</div>
                ) : null}
              </label>
              <label className='flex flex-col text-white'>
                Email:
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  type="email"
                  name="email"
                  className='text-black font-bold border border-gray-300 p-2 rounded-md'
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                ) : null}
              </label>
              <label className='flex flex-col mb-5 mt-5 text-white'>
                Profile Picture:
                <img
                  src={formik.values.profilePic ? URL.createObjectURL(formik.values.profilePic) : currentStudent?.profilePic || "https://static.vecteezy.com/system/resources/previews/000/574/512/large_2x/vector-sign-of-user-icon.jpg"}
                  alt="Current Profile"
                  className='w-20 h-20 object-cover rounded-full mb-2'
                />
                <input
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      formik.setFieldValue("profilePic", event.currentTarget.files[0]);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  type="file"
                  name="profilePic"
                  className='border border-gray-300 p-2 mt-4 rounded-md'
                />
              </label>
              <div className='flex justify-between mt-10 gap-4'>
                <button type="submit" className='bg-green-500 hover:bg-green-950 text-white p-2 rounded-md'>Save</button>
                <button type="button" onClick={onClose} className='bg-red-500 text-white p-2 rounded-md'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PostEdit;
