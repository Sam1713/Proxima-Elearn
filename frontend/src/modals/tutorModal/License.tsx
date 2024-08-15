import React from 'react';
import { EditTutor } from '../../types/modalTypes/EditModat';
import { FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { licenseAgreement } from '../../redux/tutor/tutorSlice';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const License: React.FC<EditTutor> = ({ isOpen, onClose,licensee }) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    if(licensee) return null
    if (!isOpen) return null;

    const handleAccept = async () => {
        try {
            // Show SweetAlert2 confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to accept the license agreement?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, accept it!'
            });
            const tutor_access_token=localStorage.getItem('tutor_access_token')
            console.log('tut',tutor_access_token)
            // Proceed if the user confirms
            if (result.isConfirmed) {
               const response=await axios.post('/backend/tutor/acceptLicense',null,{
                headers: {
                    'Authorization': `Bearer ${tutor_access_token}`
                  },
                  withCredentials: true,
               });
               console.log('res',response)
               dispatch(licenseAgreement(response.data.rest))

               toast.success(response.data.message)

                console.log('License accepted');
                Swal.fire(
                    'Accepted!',
                    'Your license agreement has been accepted.',
                    'success'
                );
                
            }
            navigate('/course')
            onClose()
        } catch (error) {
            console.error('Error accepting license:', error);
            Swal.fire(
                'Error!',
                'There was a problem accepting the license. Please try again.',
                'error'
            );
        }
    };

    const handleDecline = () => {
        console.log('License declined');
        onClose();
    };

    return (
        <div className='flex justify-center items-center bg-opacity-30 bg-gray-800 inset-0 fixed'>
            <ToastContainer/>
            <div className='w-[100%] md:w-full lg:w-[70%] bg-custom-gradient rounded-xl p-6 shadow-lg'>
                <h1 className='text-2xl font-bold mb-4 text-white flex justify-center'>License Agreement</h1>
                <div className='text-lg'>
                    <ul className='ml-6   space-y-4 font-serif'>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Tutors will receive 40% of the amount for each purchased course.
                        </li>
                        <li className='flex items-start text-gray-200'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Financial aid must be controlled by the admin, who will inform the tutor accordingly.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            The admin must validate each course before it is uploaded to the student side.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            The admin has the right to ban the account if any malpractice is found.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Tutors are responsible for maintaining the accuracy of the course content.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            All course materials must adhere to the platform's content guidelines and standards.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Tutors must provide timely updates to course content and respond to student feedback.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Any disputes or issues must be reported to the admin for resolution.
                        </li>
                        <li className='flex items-start text-gray-100'>
                            <FaCheckCircle className='text-green-500 mr-2 mt-2' />
                            Tutors must not share or distribute their account credentials with others.
                        </li>
                    </ul>
                </div>
                <div className='mt-6 flex justify-end space-x-4'>
                    <button
                        onClick={handleDecline}
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

export default License;
