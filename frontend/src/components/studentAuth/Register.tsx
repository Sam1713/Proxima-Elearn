import React, { useState, CSSProperties } from "react";
import { FormDataType } from "../../types/Register";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const color = "00FFFF"; // Define color here

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
      setErrors({}); 
    } catch (error:any) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data as { [key: string]: string };
        setErrors(errorMessages);
        Object.values(errorMessages).forEach((message) => toast.error(message));
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-black flex items-center justify-center shadow-xl">
      <ToastContainer className={'mt-20'} />
      <main className="w-full max-w-md bg-slate-500 p-8 rounded-lg shadow-md">
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
        <button
          type="button"
          className="my-5 w-full bg-slate-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Continue with Google
        </button>
      </main>
    </div>
  );
};

export default Register;
