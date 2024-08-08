import React, { useEffect, useState } from 'react';
import { EditTutor } from '../../types/modalTypes/EditModal';
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useFormik } from 'formik';
import { validationSchema } from '../../utils/tutorValidation/ValidationEdit';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateSuccessTutor } from '../../redux/tutor/tutorSlice';

const EditDetailModal: React.FC<EditTutor> = ({ isOpen, onClose }) => {
    const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
    const [initialEmail, setInitialEmail] = useState<string>(currentTutor?.email || '');
    const [getOtp, setGetOtp] = useState<string>('');
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [loadingOtp, setLoadingOtp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [otpVerified, setOtpVerified] = useState<boolean>(false);
    const dispatch=useDispatch()

    const formik = useFormik({
        initialValues: {
            tutorname: currentTutor?.tutorname || '',
            email: currentTutor?.email || '',
            phonenumber: currentTutor?.phonenumber || '',
            otp: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (formik.values.email !== initialEmail && !otpVerified) {
                toast.error('Please verify the OTP');
                return;
            }

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to submit the form?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!'
            });

            if (result.isConfirmed) {
                try {
                    console.log('Form submitted:', values);
                    const token=localStorage.getItem('tutor_access_token')
                    const formData=new FormData()
                    for(const key in values){
                        const value = values[key as keyof typeof values];
                        formData.append(key,String(value))

                    }
                    const response=await axios.put('/backend/tutor/updateTutor',formData,{
                        headers: {
                            'Authorization': `Bearer ${token}`
                          },
                          withCredentials: true,
                    })
                    console.log('res',response)
                    dispatch(updateSuccessTutor(response.data.data))
                    onClose()

                } catch (error) {
                    console.error('Error submitting form:', error);
                }
            }
        }
    });

    const handleOtp = async () => {
        setLoading(true);
        const email = formik.values.email;
        try {
            const response = await axios.post('/backend/tutor/sendOtp', { email });
            toast.success('OTP sent successfully');
            setGetOtp(response.data.data);
            setOtpSent(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setInitialEmail(currentTutor?.email || '');
            setOtpSent(false);
            setOtpVerified(false);
        }
    }, [isOpen, currentTutor?.email]);

    const verifyOtp = async () => {
        setLoadingOtp(true);
        const otp = formik.values.otp;
        try {
            const response = await axios.post('/backend/tutor/verifyOtp',  {otp} );
            if (response.data) {
                toast.success('OTP verified successfully');
                setOtpVerified(true);
            } else {
                toast.error('Invalid OTP');
                setOtpVerified(false);
            }
            setLoadingOtp(false);
        } catch (error) {
            console.error(error);
            setLoadingOtp(false);
        }
    };

    const spinnerStyle: React.CSSProperties = {
        border: '4px solid rgba(0,0,0,0.1)',
        borderLeft: '4px solid #ffffff',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        animation: 'spin 1s linear infinite'
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex justify-center items-center bg-white bg-opacity-30'>
            <ToastContainer />
            <div className='relative w-[90%] bg-custom-gradient p-6 rounded-2xl shadow-lg md:w-1/2'>
                <button
                    className='absolute top-2 right-2 text-white text-2xl'
                    onClick={onClose}
                    aria-label='Close'
                >
                    &times;
                </button>
                <h1 className='text-white font-bold text-center mb-4'>Edit Details</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className='relative text-center p-3'>
                        <input
                            type="text"
                            name='tutorname'
                            placeholder='Tutor Name'
                            className='pl-10 text-neutral-50 bg-gradient-to-r from-black via-black to-white rounded-2xl p-4 w-[60%] mx-auto'
                            value={formik.values.tutorname}
                            onChange={formik.handleChange}
                        />
                        <FaUser className='text-white absolute left-[23%] top-1/2 transform -translate-y-1/2' />
                        {formik.touched.tutorname && formik.errors.tutorname && (
                            <div className='absolute text-left md:mx-32 text-red-500 text-sm'>{formik.errors.tutorname}</div>
                        )}
                    </div>

                    <div className='relative text-center p-3'>
                        <input
                            type="email"
                            name='email'
                            placeholder='Email'
                            className='relative pl-10 text-neutral-50 bg-gradient-to-r from-black via-black to-white rounded-2xl p-4 w-[60%]'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        <MdEmail className='text-white absolute md:left-[23%] top-1/2 transform -translate-y-1/2' />
                        {formik.touched.email && formik.errors.email && (
                            <div className='absolute md:mx-32 text-red-500 text-sm'>{formik.errors.email}</div>
                        )}
                        {!otpVerified && formik.values.email !== initialEmail &&
                        <button
                            type='button'
                            onClick={handleOtp}
                            className='absolute bg-custom-gradient rounded-xl p-2 md:mt-2 md:ml-[-12%] animate-pulse text-sm text-white'
                            disabled={loading || otpSent}
                        >
                            {loading ? (
                                <div style={spinnerStyle}></div>
                            ) : (
                                otpSent ? 'OTP Sent' : 'Send OTP'
                            )}
                        </button>
                        }
                    </div>

                    {otpSent && !otpVerified &&
                        <div className='relative text-center p-3'>
                            <input
                                type="text"
                                name='otp'
                                placeholder='OTP'
                                className='relative pl-10 text-neutral-50 bg-gradient-to-r from-black via-black to-white rounded-2xl p-4 w-[60%]'
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                            />
                            <button
                                type='button'
                                onClick={verifyOtp}
                                className='absolute bg-custom-gradient rounded-xl p-2 md:mt-2 md:ml-[-13%] text-white'
                                disabled={loadingOtp}
                            >
                                {loadingOtp ? (
                                    <div style={spinnerStyle}></div>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </div>
                    }

                    <div className='relative text-center p-3'>
                        <input
                            type="text"
                            name='phonenumber'
                            placeholder='Phone Number'
                            className='pl-10 text-neutral-50 bg-gradient-to-r from-black via-black to-white rounded-2xl p-4 w-[60%] mx-auto'
                            value={formik.values.phonenumber}
                            onChange={formik.handleChange}
                        />
                        <FaPhoneAlt className='text-white absolute left-[23%] top-1/2 transform -translate-y-1/2' />
                        {formik.touched.phonenumber && formik.errors.phonenumber && (
                            <div className='absolute md:mx-32 text-red-500 text-sm'>{formik.errors.phonenumber}</div>
                        )}
                    </div>

                    <div className='flex items-center justify-center gap-8 mt-4'>
                        <button
                            type="submit"
                            className='w-1/4 py-2 px-4 rounded-lg bg-green-600 text-white'
                            disabled={loading || (formik.values.email !== initialEmail && !otpVerified)}
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className='w-1/4 py-2 px-4 rounded-lg bg-red-600 text-white'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDetailModal;
