import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useNavigate } from 'react-router-dom';

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

function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/backend/auth/forgotPassword', { email });
      console.log(response.data.message);
      
        setTimeout(()=>{
            toast.success("token sent to mail successfully");
        },500)
        navigate(`/resetPassword?token=${response.data.token}`);
      

    } catch (error) {
      console.error(error); 
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className='flex items-center justify-center min-h-screen bg-gray-800  bg-cover bg-center'
          style={{ backgroundImage: "url('https://cdn.wallpapersafari.com/24/93/1d9UAi.jpg')"  }}>
          <div className='w-full max-w-md bg-slate-500 p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold text-white mb-6 text-center'>Forgot Password</h2>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <label htmlFor='email' className='mb-1 text-white font-medium'>Email</label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={handleChange}
                  className='p-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-1/3 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition duration-300'
              >
                Send Reset Link
              </button>
              <button
                type='button'
                className='w-1/3 mx-60 my-20 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition duration-300'
                onClick={handleSubmit} // Changed to type='button' to avoid duplicate submission
              >
                Resend
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ForgotPassword;
