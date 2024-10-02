import React, { useState } from 'react';
import { TbPassword } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useFormik } from 'formik';
import { validationSchema, otpValidationSchema } from '../utils/studentValidation/PasswordValidation';
import Swal from 'sweetalert2';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../components/API/Api';

interface PostPasswordProps {
  onClose: () => void;
}



const PostPassword: React.FC<PostPasswordProps> = ({ onClose }) => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const [openForgotPass, setOpenForgotPass] = useState<boolean>(false);
  const [openOtpModal, setOpenOtpModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const openForgot = () => setOpenForgotPass(true);
  const closeForgot = () => {
    setOpenForgotPass(false);
    onClose();
  };

  const email = currentStudent?.email;

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      Swal.fire('Error!', 'Email is required.', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.post('/backend/auth/forgotPasswordInStudentProfile', { email });
      setLoading(false);
      Swal.fire('Success!', 'Password reset instructions have been sent to your email.', 'success');
      setOpenForgotPass(false);
      setOpenOtpModal(true);
    } catch (error) {
      setLoading(false);
      console.error("Error message: ", (error as Error).message || 'Unknown error');
      Swal.fire('Error!', `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleOtpSubmit = async (values: { otp: string; newPassword: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      await api.post('/backend/auth/verifyOtpAndResetPassword', { otp: values.otp, newPassword: values.newPassword, confirmPassword: values.confirmPassword }, {
        headers: {
          'X-Token-Type': 'student'
        }
      });
      setLoading(false);
      Swal.fire('Success!', 'Your password has been reset.', 'success');
      setOpenOtpModal(false);
      onClose();
    } catch (error) {
      console.log('err',error)
      setLoading(false);
      Swal.fire('Error!', 'An error occurred while resetting your password.', 'error');
    }
  };

  const id = currentStudent?._id || '';

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        Swal.fire('Error!', 'No authentication token found.', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit the form?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(true);
            const formData = {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword
            };

            await api.put(`/backend/auth/updatePassword/${id}`, formData, {
              headers: {
                'X-Token-Type': 'student'
              }
            });
            setLoading(false);
            Swal.fire('Submitted!', 'Your password has been updated.', 'success');
            onClose();
          } catch (error) {
            setLoading(false);
            toast.error((error as Error).message || 'Unknown error');
          }
        }
      });
    }
  });

  const otpFormik = useFormik({
    initialValues: {
      otp: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: otpValidationSchema,
    onSubmit: handleOtpSubmit
  });

  function setEmail(value: string) {
    console.log('erm',value)
    throw new Error('Function not implemented.');
  }

  return (
    <>
      {!openForgotPass && !openOtpModal && (
        <div className='inset-0 fixed flex justify-center items-center bg-black bg-opacity-50 z-40'>
          <ToastContainer />
          <div className='relative md:w-[30%] m-auto items-center md:h-[50%] bg-black p-6 rounded-lg shadow-lg w-[90%]'>
            <button
              className='absolute top-2 right-2 text-white text-2xl'
              onClick={onClose}
              aria-label='Close'
            >
              &times;
            </button>
            <h2 className='relative text-2xl text-center font-semibold mb-4 text-white'>Reset Password</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className='mb-4 mt-10 relative'>
                <input
                  className='w-full p-2 pl-10 rounded bg-custom-gradient text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='password'
                  placeholder='Current Password'
                  name='currentPassword'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                  aria-describedby='currentPasswordError'
                />
                <TbPassword className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white' />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                  <div id='currentPasswordError' className='absolute text-red-500 text-sm mb-0'>{formik.errors.currentPassword}</div>
                )}
              </div>

              <div className='mb-4 mt-10 relative'>
                <input
                  className='w-full p-2 pl-10 rounded bg-custom-gradient text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='password'
                  placeholder='New Password'
                  name='newPassword'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  aria-describedby='newPasswordError'
                />
                <TbPassword className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white' />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <div id='newPasswordError' className='absolute text-red-500 text-sm mb-0'>{formik.errors.newPassword}</div>
                )}
              </div>

              <div className='text-white shadow-lg float-right'>
                <h1 onClick={openForgot} className='hover:text-red-400 cursor-pointer'>Forgot Password?</h1>
              </div>
              <div className='w-1/2 mx-auto'>
                <button
                  type='submit'
                  className='bg-white bg-opacity-60 text-white p-2 mt-5 w-full rounded hover:bg-custom-gradient'
                  disabled={loading}
                >
                  {loading ? (
  <MoonLoader
    color="#000"
    loading={loading}
    size={20}
    aria-label="Loading Spinner"
    data-testid="loader"
    style={{ margin: '0 auto' }} // Add any other styles as needed
  />
) : (
  'Submit'
)}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openForgotPass && (
        <div className='inset-0 fixed flex justify-center items-center bg-black bg-opacity-50 z-40'>
          <div className='relative md:w-[30%] m-auto items-center md:h-[50%] bg-black p-6 rounded-lg shadow-lg w-[90%]'>
            <button
              className='absolute top-2 right-2 text-white text-2xl'
              onClick={closeForgot}
              aria-label='Close'
            >
              &times;
            </button>
            <h2 className='relative text-2xl text-center font-semibold mb-4 text-white'>Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className='mb-4 relative'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className='w-full p-2 border border-gray-400 rounded mb-4'
                  required
                />
              </div>
              <button
                type='submit'
                className='bg-white text-black p-2 rounded w-full hover:bg-gray-300'
                disabled={loading}
              >
               {loading ? (
  <MoonLoader
    color="#000"
    loading={loading}
    size={20}
    aria-label="Loading Spinner"
    data-testid="loader"
    style={{ margin: '0 auto' }} // Add any other styles as needed
  />
) : (
  'Send OTP'
)}

              </button>
            </form>
          </div>
        </div>
      )}

      {openOtpModal && (
        <div className='inset-0 fixed flex justify-center items-center bg-black bg-opacity-50 z-40'>
          <div className='relative md:w-[30%] m-auto items-center md:h-[50%] bg-black p-6 rounded-lg shadow-lg w-[90%]'>
            <button
              className='absolute top-2 right-2 text-white text-2xl'
              onClick={() => setOpenOtpModal(false)}
              aria-label='Close'
            >
              &times;
            </button>
            <h2 className='relative text-2xl text-center font-semibold mb-4 text-white'>Verify OTP</h2>
            <form onSubmit={otpFormik.handleSubmit}>
              <div className='mb-4 relative'>
                <input
                  type='text'
                  placeholder='Enter OTP'
                  name='otp'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.otp}
                  className='w-full p-2 border border-gray-400 rounded mb-4'
                  required
                />
              </div>
              <div className='mb-4 relative'>
                <input
                  type='password'
                  placeholder='New Password'
                  name='newPassword'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.newPassword}
                  className='w-full p-2 border border-gray-400 rounded mb-4'
                  required
                />
              </div>
              <div className='mb-4 relative'>
                <input
                  type='password'
                  placeholder='Confirm New Password'
                  name='confirmPassword'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.confirmPassword}
                  className='w-full p-2 border border-gray-400 rounded mb-4'
                  required
                />
              </div>
              <button
                type='submit'
                className='bg-white text-black p-2 rounded w-full hover:bg-gray-300'
                disabled={loading}
              >
                {loading ? (
  <MoonLoader
    color="#000"
    loading={loading}
    size={20}
    aria-label="Loading Spinner"
    data-testid="loader"
    style={{ margin: '0 auto' }} // Add any other styles as needed
  />
) : (
  'Reset Password'
)}

              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PostPassword;
