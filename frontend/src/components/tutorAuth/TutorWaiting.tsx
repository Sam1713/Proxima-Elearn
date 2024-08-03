import React from 'react';

function TutorWaiting() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: "url(https://wallpapercave.com/wp/wp2832043.jpg)" }}
    >
      <div className='bg-white bg-opacity-80 p-8 md:p-12 lg:p-16 rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-105'>
        <div className='text-center'>
          <h1 className='text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 animate-pulse'>Waiting for Approval</h1>
          <p className='text-base md:text-lg text-gray-700 mb-6'>
            Thank you for your patience!
            <br />
            Your request to access the profile is being reviewed by our admin team.
            <br />
            Please wait for approval before proceeding.
          </p>
          <p className='text-sm md:text-base text-gray-600'>
            Estimated Wait Time: 24-48 hours
            <br />
            Status: Pending Review
            <br />
            Please note:
            <br />
            - Our admin team will review your request and verify your information.
            <br />
            - You will receive an email notification once your request is approved or rejected.
            <br />
            - If approved, you will be able to access your profile and start using our platform.
            <br />
            Thank you for your understanding!
          </p>
        </div>
      </div>
    </div>
  );
}

export default TutorWaiting;
