import React, { useState} from "react";
import { FormDataType } from "../../types/Register";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import { override,color } from "../../utils/ClipLoader";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../../firebase/GoogleAuth";


const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate=useNavigate()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/backend/auth/signup', formData);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
      setErrors({}); 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen  flex items-center justify-center shadow-xl bg-cover bg-center"
    style={{ backgroundImage: "url('https://cdn.wallpapersafari.com/24/93/1d9UAi.jpg')" }}>
      <ToastContainer className={'mt-20'} />
      <main className="w-full max-w-md opacity-60 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 font-medium">Username</label>
            <input
              onChange={handleChange}
              id="username"
              type="text"
              className="p-2 border border-gray-300 rounded"
              required
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email</label>
            <input
              onChange={handleChange}
              id="email"
              type="email"
              className="p-2 border border-gray-300 rounded-full"
              required
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">Password</label>
            <input
              onChange={handleChange}
              id="password"
              type="password"
              className="p-2 border border-gray-300 rounded"
              required
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1 font-medium">Confirm Password</label>
            <input
              onChange={handleChange}
              id="confirmPassword"
              type="password"
              className="p-2 border border-gray-300 rounded"
              required
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            {loading ? (
              <ClipLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              'Signup'
            )}
          </button>
        </form>
        <GoogleAuth/>
      </main>
    </div>
  );
};

export default Register;
