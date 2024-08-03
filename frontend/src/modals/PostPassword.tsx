import React, { useState } from 'react';
import { TbPassword } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useFormik } from 'formik';
import { validationSchema, otpValidationSchema } from '../utils/studentValidation/PasswordValidation';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';
import { css } from '@emotion/react';

interface PostPasswordProps {
  onClose: () => void;
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

  const email=currentStudent?.email
  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/backend/auth/forgotPasswordInStudentProfile', {email} );
      setLoading(false);
      Swal.fire('Success!', 'Password reset instructions have been sent to your email.', 'success');
      setOpenForgotPass(false);
      setOpenOtpModal(true);
    } catch (error) {
      setLoading(false);
      Swal.fire('Error!', 'An error occurred while sending the reset instructions.', 'error');
    }
  };

  const handleOtpSubmit = async (values: { otp: string, newPassword: string, confirmPassword: string }) => {
    try {
      setLoading(true);
      await axios.post('/backend/auth/verifyOtpAndResetPassword', { email, otp: values.otp, newPassword: values.newPassword });
      setLoading(false);
      Swal.fire('Success!', 'Your password has been reset.', 'success');
      setOpenOtpModal(false);
      onClose();
    } catch (error) {
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

            await axios.put(`/backend/auth/updatePassword/${id}`, formData, {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setLoading(false);
            Swal.fire('Submitted!', 'Your password has been updated.', 'success');
            onClose();
          } catch (error) {
            setLoading(false);
            Swal.fire('Error!', 'An error occurred while updating your password.', 'error');
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

  return (
    <>
      {!openForgotPass && !openOtpModal && (
        <div className='inset-0 fixed flex justify-center items-center bg-black bg-opacity-50 z-40'>
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
                {formik.touched.currentPassword && formik.errors.currentPassword ? (
                  <div id='currentPasswordError' className='absolute  text-red-500 text-sm mb-0'>{formik.errors.currentPassword}</div>
                ) : null}
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
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div id='newPasswordError' className='absolute text-red-500 text-sm mb-0'>{formik.errors.newPassword}</div>
                ) : null}
              </div>

              <div className='text-white shadow-lg float-right'>
                <h1 onClick={openForgot} className='hover:text-red-400 cursor-pointer'>Forgot Password?</h1>
              </div>
              <div className='w-1/2 mx-auto'>
                <button
                  type='submit'
                  className='bg-custom-gradient text-white p-2 rounded'
                  disabled={loading}
                >
                  {loading ? (
                    <MoonLoader
                      color="#fff"
                      loading={loading}
                      css={spinnerStyle}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
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
                  value={currentStudent?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full p-2 border border-gray-400 rounded mb-4 focus:outline-blue-600'
                />
              </div>
              <button
                type='submit'
                className='bg-custom-gradient text-white p-2 rounded'
                disabled={loading}
              >
                {loading ? (
                  <MoonLoader
                    color="#fff"
                    loading={loading}
                    css={spinnerStyle}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
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
          <div className='relative md:w-[30%] m-auto items-center md:h-[60%] bg-black p-6 rounded-lg shadow-lg w-[90%]'>
            <button
              className='absolute top-2 right-2 text-white text-2xl'
              onClick={() => setOpenOtpModal(false)}
              aria-label='Close'
            >
              &times;
            </button>
            <h2 className='relative text-2xl text-center font-semibold mb-4 text-white'>Enter OTP</h2>
            <form className='w-full' onSubmit={otpFormik.handleSubmit}>
              <div className='mb-4 mt-0 relative'>
                <input
                  className='w-full p-2 pl-10 rounded bg-custom-gradient text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='text'
                  placeholder='Enter OTP'
                  name='otp'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.otp}
                  aria-describedby='otpError'
                />
                {otpFormik.touched.otp && otpFormik.errors.otp ? (
                  <div id='otpError' className='absolute text-red-500 text-sm mb-0'>{otpFormik.errors.otp}</div>
                ) : null}
              </div>

              <div className='mb-4 mt-10 relative'>
                <input
                  className='w-full p-2 pl-10 rounded bg-custom-gradient text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='password'
                  placeholder='New Password'
                  name='newPassword'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.newPassword}
                  aria-describedby='newPasswordOtpError'
                />
                <TbPassword className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white' />
                {otpFormik.touched.newPassword && otpFormik.errors.newPassword ? (
                  <div id='newPasswordOtpError' className='absolute text-red-500 text-sm mb-0'>{otpFormik.errors.newPassword}</div>
                ) : null}
              </div>

              <div className='mb-4 mt-10 relative'>
                <input
                  className='w-full p-2 pl-10 rounded bg-custom-gradient text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='password'
                  placeholder='Confirm New Password'
                  name='confirmPassword'
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.confirmPassword}
                  aria-describedby='confirmPasswordOtpError'
                />
                <TbPassword className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white' />
                {otpFormik.touched.confirmPassword && otpFormik.errors.confirmPassword ? (
                  <div id='confirmPasswordOtpError' className='absolute text-red-500 text-sm mb-0'>{otpFormik.errors.confirmPassword}</div>
                ) : null}
              </div>

              <div className='w-full justify-center flex md:mt-20'>
                <button
                  type='submit'
                  className='bg-custom-gradient text-white p-2 rounded'
                  disabled={loading}
                >
                  {loading ? (
                    <MoonLoader
                      color="#fff"
                      loading={loading}
                      css={spinnerStyle}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
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
    </>
  );
};

export default PostPassword;
