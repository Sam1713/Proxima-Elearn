import React, { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { validationSchema } from '../../utils/tutorValidation/ValidationSignin';
import { useFormik } from 'formik';
import { TutorSigninType } from '../../types/TutorTypes';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { signinFailure, signinStart, signinSuccess } from '../../redux/tutor/tutorSlice';
import { AppDispatch } from '../../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const initialValues: TutorSigninType = {
  email: '',
  password: '',
};

function TutorSignin() {
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>()
  const formik = useFormik<TutorSigninType>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
        try{
            dispatch(signinStart())
        const formdata=new FormData()
        formdata.append('email', values.email);
        formdata.append('password', values.password);
        console.log("form",formdata)
      console.log('Form submitted');
      console.log(values);
      const response=await axios.post("/backend/tutor/tutorsignin",values,{
        withCredentials: true,
        credentials:'include'
      })
      localStorage.setItem('tutor_access_token', response.data.token);
      console.log('Token saved:', localStorage.getItem('access_token'));
      toast.success(response.data.message)
      dispatch(signinSuccess(response.data.rest))
      navigate('/tutorwait')
      


      console.log('res',response)
    }catch(error){
        toast.error(error)
        signinFailure(error)
        console.log(error)
    }},
  });

  return (
    
    <div
      className="relative pt-2 font-poppins min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(https://wallpapercave.com/wp/wp2832043.jpg)" }}
    >
        <ToastContainer/>
      <div className="p-8 rounded-lg bg-white bg-opacity-20 shadow-2xl border w-11/12 md:w-2/3 lg:w-1/3">
        <form onSubmit={formik.handleSubmit} className='mx-auto'>
          <h1 className='text-3xl font-extrabold text-center mb-6'>Signin</h1>
          <div className='flex flex-wrap mb-4 mx-auto'>
            <div className='w-full md:w-full pr-2 relative mb-4 sm:mb-0 mx-auto'>
              <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Email'
                className='w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-400 font-bold">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className='w-full md:w-full pr-2 relative mb-4 sm:mb-0 mx-auto'>
            <MdEmail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='Password'
              className='w-full px-4 pl-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-400 font-bold">{formik.errors.password}</div>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              className='w-full bg-red-600 pb-2 items-center rounded-lg my-7'
            >
              Signin
            </button>
          </div>
          <div className='my-1'>
            <Link to='/tutorsignup' className='text-blue-200'>Don't have an account?</Link>
            </div>
        </form>
      </div>
    </div>
  );
}

export default TutorSignin;
