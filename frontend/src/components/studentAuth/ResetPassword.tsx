import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../API/Api'
const ResetPassword:React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'token') setToken(value);
    else if (id === 'password') setPassword(value);
    else if (id === 'confirmPassword') setConfirmPassword(value);
  };

  
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await api.post(`/backend/auth/resetPassword/${token}`, { password, token });
    toast.success(response.data.message);
    console.log(response.data.message)
      setLoading(false);
      navigate('/signin');
      
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black bg-cover bg-center'>
      <ToastContainer />
      <div className='w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-white mb-6 text-center'>Reset Password</h2>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='flex flex-col'>
            <label htmlFor='token' className='mb-1 text-white font-medium'>Token</label>
            <input
              type='text'
              id='token'
              value={token}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' className='mb-1 text-white font-medium'>New Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='confirmPassword' className='mb-1 text-white font-medium'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition duration-300'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
