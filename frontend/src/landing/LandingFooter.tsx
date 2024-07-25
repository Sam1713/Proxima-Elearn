import React from 'react';

function LandingFooter() {
  return (
    <footer className='w-full bg-gray-900 text-white py-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {/* Logo or Brand Name */}
          <div className='mb-4 md:mb-0'>
            <h2 className='text-2xl font-bold'>Proxima ELearn</h2>
          </div>
          
          {/* Navigation Links */}
          <div className='flex space-x-6'>
            <a href='#' className='hover:text-gray-400'>Home</a>
            <a href='#' className='hover:text-gray-400'>About Us</a>
            <a href='#' className='hover:text-gray-400'>Courses</a>
            <a href='#' className='hover:text-gray-400'>Contact</a>
          </div>
          
          {/* Social Media Icons */}
          <div className='flex space-x-4 mt-4 md:mt-0'>
            <a href='#' className='hover:text-gray-400'>
              <i className='fab fa-facebook-f'></i>
            </a>
            <a href='#' className='hover:text-gray-400'>
              <i className='fab fa-twitter'></i>
            </a>
            <a href='#' className='hover:text-gray-400'>
              <i className='fab fa-instagram'></i>
            </a>
            <a href='#' className='hover:text-gray-400'>
              <i className='fab fa-linkedin-in'></i>
            </a>
          </div>
        </div>
        
        {/* Copyright Text */}
        <div className='mt-4 text-center text-gray-500'>
          © 2024 Proxima ELearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
