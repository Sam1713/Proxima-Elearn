import React, { useEffect } from 'react';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { setStudentPayment } from '../../redux/courses/courseSlice';
import { RootState } from '../../redux/store';

function PaymentInfo() {
    const dispatch = useDispatch();
    const studentPayment = useSelector((state: RootState) => state.course.studentPaymentDetailsArray);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await api.get('/backend/enroll/getPaymentDetails', {
                    headers: {
                        'X-Token-Type': 'student',
                    },
                });
                console.log('Response:', response.data);
                dispatch(setStudentPayment(response.data.data));
            } catch (error) {
                console.error('Failed to fetch payment details:', error);
            }
        };
        fetchPaymentDetails();
    }, [dispatch]);

    console.log('Student Payment Details:', studentPayment);

    // Function to format the created_at timestamp
    const formatCreatedAt = (createdAt: string): string => {
        const date = new Date(createdAt);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    };

    return (
        <div className="w-full mt-10 md:w-[90%] h-[80vh] overflow-y-scroll mx-auto p-6 bg-white bg-opacity-20 shadow-2xl rounded-lg">
            <h1 className="font-bold text-gray-100 text-2xl underline text-center mb-6">Your Payment History</h1>
            {studentPayment.length > 0 ? (
                studentPayment.map((paymentInfo, index) => {
                    const paymentDetails = paymentInfo.PaymentDetails;
                    return (
                        <div
                            key={index}
                            className="w-[90%] mx-auto bg-white  bg-opacity-60 p-6 h-[30vh] overflow-y-scroll mb-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
                            style={{ border: '1px solid #e5e7eb' }} // Adding a border for clear separation
                        >
                            <div className="flex items-start mb-4">
                                <img
                                    className="w-20 h-20 object-cover rounded-full border-4 border-indigo-500 shadow-lg"
                                    src={paymentDetails.coverImage}
                                    alt={paymentDetails.title}
                                />
                                <div className="ml-6">
                                    <h2 className="text-2xl font-bold ">{paymentDetails.title}</h2>
                                    <p className="text-xl font-semibold text-gray-700 m">${paymentDetails.amount.toFixed(2)}</p>
                                    <p className="text-lg text-gray-700 ">
                                        Date: {formatCreatedAt(paymentDetails.created_at)}
                                    </p>
                                    <p className="text-lg text-gray-700 ">OrderId:{paymentDetails?.paymentId}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-900 ">{paymentDetails.description}</p>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-500">No payment details found.</p>
            )}
        </div>
    );
}

export default PaymentInfo;
