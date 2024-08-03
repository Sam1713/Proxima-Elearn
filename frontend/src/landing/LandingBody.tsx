import React from 'react'
import image from '../assets/images/OIP__29_-removebg-preview.png'; 
import { FaRegPlayCircle } from "react-icons/fa";
import LandingDescription from './LandingDescription';

function LandingBody() {
  return (
    <div className='bg-gradient-to-r from-gray-800 via-black to-gray-800 w-full mx-auto '>
    <div className=' pt-20 relative h-screen bg-gradient-to-r from-gray-800 via-black to-gray-800'>
      <div className='bg-indigo-400 bg-opacity-90 h-1/2 rounded-lg sm:rounded-full md:rounded-3xl lg:rounded-b-3xl w-[90%] mx-auto my-5'>
        <div className='relative flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between px-4 py-8 lg:px-16 lg:py-12'>
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2'>
            <h1 className='text-2xl font-bold mb-4 lg:text-3xl'>
              Studying Online is now much easier
            </h1>
            <div className='bg-sky-300 w-full max-w-md rounded-lg p-4'>
              <span className='font-serif block mb-2 font-extrabold text-white underline'>
                Proxima E-Learn
              </span>
              <span className='text-white'>
                This is an interesting platform that will teach you in a more interactive way
              </span>
             

            </div>
            <div className='w-50 mt-4 flex justify-between items-center cursor-pointer'>
            <FaRegPlayCircle className='lg:text-5xl text-black-500 transform transition-transform duration-300 hover:scale-125' />


              <span className='mx-5'>
                Join for free
              </span>
            </div>
          </div>
          <img
            className='w-3/4 sm:w-2/3  md:w-1/2 lg:w-1/3 max-w-xs lg:max-w-[16%] h-auto object-contain hover:rotate-3 transition-transform duration-300'
            src={image}
            alt="Online Learning"
          />
        </div>
      </div>
      <LandingDescription />
    </div>
    </div>
  )
}

export default LandingBody
