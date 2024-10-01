import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRupeeSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../API/Api'
const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate=useNavigate()
  const { order, student, title, amount } = location.state as any;
  console.log('stude',student);
  console.log('fsdf',amount);
  
  
console.log('cor',title);

  const handlePayment = () => {
    Swal.fire({
      title: 'Confirm Payment',
      text: `Are you sure you want to proceed with the payment of ₹${Math.floor(order.amount_due/100)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_API_KEY, 
          amount: amount * 100, 
          currency: 'INR',
          name: title,
          description: 'Course Enrollment',
          image: 'YOUR_LOGO_URL', 
          order_id: order.id, 
          handler: async function (response: any) {
            try {
              await api.post('/backend/enroll/verifyPayment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              });
              Swal.fire({
                title: 'Payment Successful!',
                text: 'Your payment has been verified.',
                icon: 'success',
                confirmButtonText: 'Ok'
              });

            } catch (error) {
              console.error('Payment Verification Error:', error);
              Swal.fire({
                title: 'Payment Verification Failed!',
                text: 'There was an error verifying your payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
            }
            navigate('/courses')
          },
          prefill: {
            name: student.username,
            email: student.email,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    });
  };

  return (
    <div className="md:py-16 min-h-screen bg-custom-gradient flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-black bg-opacity-30 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>

        <div className="mb-8 bg-custom-gradient bg-opacity-80 p-6 text-white rounded-lg shadow-md animate-pulse" style={{ boxShadow: '0 4px 15px rgba(255, 0, 0, 10)' }}>
          <h2 className="text-3xl mb-4 text-white font-extralight">Customer Information</h2>
          <div className="mb-4">
            <p className="text-lg"><strong>Name:</strong> {student.username}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg"><strong>Email:</strong> {student.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg"><strong>Course Title:</strong> {title}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-white opacity-50 pt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Subtotal</h2>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaRupeeSign className='mr-2' /> {Math.floor(order.amount/100)}
            </h2>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Taxes</h2>
            <h2 className="text-xl font-semibold text-white">00.00</h2>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-white">Order Total</h2>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaRupeeSign className='mr-2' /> {Math.floor(order.amount_due/100)}
            </h2>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center">
          <button onClick={handlePayment} className="w-full max-w-xs p-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 transition duration-200">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
