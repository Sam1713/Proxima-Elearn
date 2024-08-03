import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser } from 'react-icons/fa';
import { MdEmail, MdPictureAsPdf, MdRemoveCircle } from 'react-icons/md';
import { TutorTypes } from '../../types/TutorTypes';
import { validationSchema } from '../../utils/tutorValidation/Validation';
import { ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const TutorSignup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<TutorTypes>({
    initialValues: {
      tutorname: '',
      email: '',
      password: '',
      countrycode: '+1',
      phonenumber: '',
      bio: '',
      files: []
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
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
          setLoading(true);
          const formData = new FormData();

          for (const key in values) {
            if (key !== 'files') {
              const value = values[key as keyof TutorTypes];
              if (value !== undefined) {
                formData.append(key, String(value));
              }
            }
          }

          values.files.forEach(file => formData.append('files', file));
          console.log(values);
          try {
            const response = await axios.post('/backend/tutor/tutorsignup', formData);
            console.log(response);
            toast.success(response.data.message);
            resetForm(); // Reset the form fields
          } catch (error) {
            toast.error('Something went wrong');
          } finally {
            setLoading(false);
          }
        }
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      formik.setFieldValue('files', [...formik.values.files, ...files]);
    }
  };

  const handleFileRemove = (fileToRemove: File) => {
    formik.setFieldValue('files', formik.values.files.filter(file => file !== fileToRemove));
    console.log(formik.values);
  };

  return (
    <>
      <div
        className={`relative pt-20 font-poppins min-h-screen flex items-center justify-center bg-cover bg-center ${
          loading ? 'opacity-50' : ''
        }`}
        style={{ backgroundImage: "url(https://wallpapercave.com/wp/wp2832043.jpg)" }}
      >
        <ToastContainer />
        
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <ClipLoader
              color="#fff"
              loading={loading}
              css={{ margin: '0 auto' }}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        
        <div className={`relative z-10 p-8 rounded-lg bg-white bg-opacity-20 shadow-2xl border- w-11/12 md:w-3/4 lg:w-2/4 ${loading ? 'pointer-events-none' : ''}`}>
          <form onSubmit={formik.handleSubmit}>
            <h1 className='text-3xl font-extrabold text-center mb-6'>Signup</h1>
            <div className='flex flex-wrap mb-4'>
              <div className='w-full md:w-2/4 pr-2 relative mb-4 sm:mb-0'>
                <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                <input
                  type="text"
                  name="tutorname"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tutorname}
                  placeholder='Tutor Name'
                  className='w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {formik.touched.tutorname && formik.errors.tutorname ? (
                  <div className="text-red-400 font-bold">{formik.errors.tutorname}</div>
                ) : null}
              </div>

              <div className='w-full md:w-2/4 pr-2 relative mb-4 sm:mb-0'>
                <MdEmail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder='Email'
                  className='w-full px-4 pl-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-400 font-bold">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap mb-4 my-[-2%] md:my-5">
              <div className="w-1/4 md:w-[10%] pr-2">
                <select
                  name="countrycode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.countrycode}
                  className="w-full h-10 from-neutral-50 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                </select>
                {formik.touched.countrycode && formik.errors.countrycode ? (
                  <div className="text-red-400 font-bold">{formik.errors.countrycode}</div>
                ) : null}
              </div>
              <div className="w-3/4 md:w-2/5 pr-2 mb-4 sm:mb-0">
                <input
                  type="text"
                  name="phonenumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phonenumber}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.phonenumber && formik.errors.phonenumber ? (
                  <div className="text-red-400 font-bold">{formik.errors.phonenumber}</div>
                ) : null}
              </div>
              <div className="w-[98%] md:w-[49%]">
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="bg-transparent opacity-100 text-red-400 font-bold">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>

            <div className='mb-4'>
              <textarea
                name="bio"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
                placeholder='About yourself..'
                className='w-[98%] md:w-[99%] px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={4}
              />
              {formik.touched.bio && formik.errors.bio ? (
                <div className="text-red-400 font-bold">{formik.errors.bio}</div>
              ) : null}
            </div>

            <div className='mb-6'>
              <input
                type="file"
                name="files"
                onChange={handleFileChange}
                multiple
                className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-4 py-2 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-lg transition-all duration-300"
              />
            </div>

            {formik.values.files.length > 0 && (
              <div className="mb-6 p-3 text-center flex flex-wrap gap-2 object-cover w-full bg-slate-300 overflow-auto">
                {formik.values.files.map((file: File, index: number) => (
                  <div key={index} className="relative flex flex-col items-center">
                    {file.type === 'application/pdf' ? (
                      <div className="md:w-20 mx-2 h-auto rounded shadow-lg mb-2 flex items-center justify-center bg-white">
                        <MdPictureAsPdf className="text-red-200 w-16 h-16" />
                      </div>
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index}`}
                        className="md:w-20 object-cover bg-cover bg-center mx-2 h-24 rounded shadow-lg mb-2"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleFileRemove(file)}
                      className="absolute top-0 right-0 mt-0 mr-1 text-red-500"
                    >
                      <MdRemoveCircle size={24} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='mx-auto md:mx-0 w-full md:w-1/5 bg-red-500 text-center rounded-lg hover:bg-red-900'>
              <button type='submit' className='p-2'>Submit</button>
            </div>
            <div className='my-3'>
            <Link to='/tutorsignin' className='text-blue-200'>Already registered?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TutorSignup;
