import React, { useState} from "react";
import { FormDataType } from "../../types/Register";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import { override,color } from "../../utils/ClipLoader";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../../firebase/GoogleAuth";
import { Button, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion'
import api from '../API/Api'
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
      const response = await api.post('/backend/auth/signup', formData);
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
    <div className="pt-20 bg-black min-h-screen  flex items-center justify-center shadow-xl bg-cover bg-center">
      <ToastContainer className={'mt-20'} />
      <motion.main className="w-full max-w-md  bg-gray-900 p-8 rounded-lg shadow-md"
       initial={{ opacity: 0, y: 200 }}  // Initial state before animation
 animate={{ opacity: 1, y: 0 }}    // Final state after animation
 transition={{ duration: 0.8, ease: "easeOut" }}>
        <h1 className="text-2xl font-semibold mb-6 text-white font-protest">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
          <Input
              onChange={handleChange}
              type="text"
              id="username"
              color="white"
              label="Username"
              required crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           />
           
           {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}

          </div>
          <div className="flex flex-col">
            <Input
              onChange={handleChange}
              label="email"
              color="white"
              id="email"
              type="email"
              className="p-2 border border-gray-300 "
              required crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <Input
              onChange={handleChange}
              label="password"
              color="white"
              id="password"
              type="password"
              className="p-2 border border-gray-300 "
              required crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div className="flex flex-col">
            <Input
              onChange={handleChange}
              label="Confirm password"
              color="white"
              id="confirmPassword"
              type="password"
              className="p-2 border border-gray-300 rounded"
              required crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
          </div>
          <Button
            type="submit"
            className="w-full  bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
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
          </Button>
         

        </form>
        
        <GoogleAuth/>
        <div className="flex justify-between text-blue-500">
        <div>
        <Link to='/signin'>
          Already Registered?
        </Link></div>
        <div>
        <Link to="/tutorSignup">
        Tutor Register?
        </Link>
        </div>
        </div>
      </motion.main>
      
    </div>
  );
};

export default Register;
