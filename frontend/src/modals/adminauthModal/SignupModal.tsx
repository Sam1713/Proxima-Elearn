import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import adminImage from '../../assets/images/OIP (31).jpeg';
import { FcGoogle } from "react-icons/fc";
import { useFormik } from 'formik';
import { validationSchema } from '../../utils/adminValidation/AdminValidation';
import { AdminSignupType } from '../../types/adminTypes/AdminType';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch} from 'react-redux';
import { adminSignInSuccess } from '../../redux/admin/adminSlice';
import { useNavigate } from 'react-router-dom';
import api from '../../components/API/Api'
interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    formType: 'signup' | 'signin';
    showToast: (message: string, type: 'success' | 'error') => void;
    onSwitchFormType: (formType: 'signup' | 'signin') => void;
}

interface ErrorResponse {
    message: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, formType, showToast, onSwitchFormType }) => {
    const dispatch=useDispatch()
    console.log('SignupModal props:', { isOpen, formType });
const navigate=useNavigate()
const formik = useFormik<AdminSignupType>({
    initialValues: {
        username: formType === 'signup' ? '' : '',
        email: '',
        password: ''
    },
    validationSchema: validationSchema(formType),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
        console.log('Submitting form:', values);

        const formData = new FormData();
        for (const key in values) {
            formData.append(key, String(values[key as keyof AdminSignupType]));
        }

        try {
            const endpoint = formType === 'signup' ? '/backend/admin/adminSignup' : '/backend/admin/adminSignin';

            // Set the headers including X-Token-Type
            const headers = {
                'X-Token-Type': 'admin',
            };

            const response = await api.post(endpoint, formData, { headers });

            localStorage.setItem('admin_access_token', response.data.token);
            console.log('Token saved:', localStorage.getItem('admin_access_token'));

            showToast(response.data.message, 'success');
            resetForm();

            if (formType === 'signup') {
                onSwitchFormType('signin');
            } else {
                dispatch(adminSignInSuccess(response.data.rest));
                navigate('/admin/tutorlist');
                console.log('Signin successful');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                const errResponse = error.response.data as ErrorResponse;
                showToast(errResponse.message, 'error');
            } else {
                showToast('An unexpected error occurred.', 'error');
            }
            console.error('Error:', error);
        }
    }
});

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log('Handle submit triggered');
    //     formik.handleSubmit();
    // };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="md:w-1/3 bg-custom-gradient p-8 rounded-lg mt-20">
                <div className='mx-auto mb-4 flex justify-center'>
                    <img className='rounded-full w-36' src={adminImage} alt="Admin" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white text-center">
                    {formType === 'signup' ? 'Signup Form' : 'Signin Form'}
                </h2>
                <form onSubmit={formik.handleSubmit}>
                {formType === 'signup' && (
                        <div className='relative mb-4'>
                            <input
                                type="text"
                                name="username"
                                placeholder='Username'
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className='px-10 py-3 w-full rounded-md'
                            />
                            <FaUser className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
                            {formik.touched.username && formik.errors.username && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                            )}
                        </div>
                    )}
                    <div className='relative mb-4'>
                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='px-10 py-3 w-full rounded-md'
                        />
                        <MdEmail className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className='relative mb-4'>
                        <input
                            type="password"
                            name="password"
                            placeholder='Password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='px-10 py-3 w-full rounded-md'
                        />
                        <RiLockPasswordFill className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        )}
                    </div>
                    <button
                        type='submit'
                        className="mt-4 py-2 px-4 bg-custom-gradient text-white rounded-lg w-full"
                    >
                        {formType === 'signup' ? 'Signup' : 'Signin'}
                    </button>
                </form>
                <div className='relative mt-2'>
                    <button
                        onClick={() => console.log('Google signup')}
                        className="relative py-2 px-4 bg-custom-gradient text-white rounded-lg w-full flex items-center justify-center"
                    >
                        <FcGoogle className='mr-2 text-2xl' />
                        {formType === 'signup' ? 'Signup with Google' : 'Signin with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;
