import React, { useState } from 'react';
import  { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import api from '../API/Api'

const spinnerStyle = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

const ForgotPassword:React.FC=()=> {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/backend/auth/forgotPassword', { email },{
       
      });
      console.log(response.data.message);
      
        setTimeout(()=>{
            toast.success("token sent to mail successfully");
        },500)
        navigate(`/resetPassword?token=${response.data.token}`);
      

    }
      catch (error: unknown) {
        setLoading(false);

        console.error(error); 
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          toast.error((axiosError.response.data as string));
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
            style={spinnerStyle}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className='flex items-center justify-center min-h-screen bg-black  bg-cover bg-center'>
          <div className='w-full max-w-md bg-slate-500 p-8 rounded-lg bg-gray-900 shadow-lg'>
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
              {/* <button
                type='button'
                className='w-1/3 mx-60 my-20 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition duration-300'
                onClick={handleSubmit} 
              >
                Resend
              </button> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ForgotPassword;
