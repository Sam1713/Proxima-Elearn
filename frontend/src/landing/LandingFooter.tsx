import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const LandingFooter:React.FC=()=> {
  return (
    <footer className=' text-gray-900 py-12 bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {/* Logo or Brand Name */}
          <div className='mb-6 md:mb-0 text-center md:text-left'>
            <h2 className='text-3xl text-gray-300 font-extrabold font-protest'>Proxima E-Learn</h2>
            <p className='text-gray-500 mt-2 font-poppins'>Empowering your learning journey</p>
          </div>
          
          {/* Navigation Links */}
          <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-red-500'>
            <a href='#' className='hover:text-gray-400 transition-colors text-lg'>Home</a>
            <a href='#' className='hover:text-gray-400 transition-colors text-lg'>About Us</a>
            <a href='#' className='hover:text-gray-400 transition-colors text-lg'>Courses</a>
            <a href='#' className='hover:text-gray-400 transition-colors text-lg'>Contact</a>
          </div>
          
          {/* Social Media Icons */}
          <div className='flex space-x-6 mt-6 md:mt-0 text-black'>
            <a href='#' className=' hover:text-gray-100 text-gray-300 transition-colors' aria-label="Facebook">
              <FaFacebookF className='w-6 h-6' />
            </a>
            <a href='#' className=' hover:text-gray-100 text-gray-300 transition-colors' aria-label="Twitter">
              <FaTwitter className='w-6 h-6' />
            </a>
            <a href='#' className=' hover:text-gray-100 text-gray-300 transition-colors' aria-label="Instagram">
              <FaInstagram className='w-6 h-6' />
            </a>
            <a href='#' className=' hover:text-gray-100 text-gray-300 transition-colors' aria-label="LinkedIn">
              <FaLinkedinIn className='w-6 h-6' />
            </a>
          </div>
        </div>
        
        {/* Copyright Text */}
        <div className='mt-8 text-center text-gray-900'>
          <p className='text-sm text-gray-400 ml-20'>© 2024 Proxima ELearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
