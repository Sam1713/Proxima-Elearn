import React from 'react';
import { Card, CardHeader, Typography } from '@material-tailwind/react';

const OrderCourseShimmer = () => {
  return (
    <div className='bg-custom-gradient min-h-screen py-16'>
      <div className='px-6 md:px-12'>
        <Card className="animate-pulse bg-gray-900 rounded-lg shadow-lg">
          <CardHeader
            shadow={false}
            floated={false}
            className="md:h-[70vh] bg-gray-400 flex p-6 rounded-t-lg"
          >
            {/* Left Side - Typography */}
            <div className='flex-1 flex flex-col space-y-4 my-40'>
              <div className="h-4 w-[50%] rounded bg-gray-300"></div>
              <div className="h-4 w-[40%] rounded bg-gray-300"></div>
              <div className="h-4 w-[30%] rounded bg-gray-300"></div>
            </div>

            {/* Right Side - Image Skeleton */}
            <div className='w-[40%] ml-6 my-8 flex-shrink-0'>
              <div className='h-[60vh] bg-gray-300 rounded-xl'></div>
            </div>
          </CardHeader>
        </Card>

        {/* Additional Typography Components */}
        <div className='flex justify-evenly items-center mt-10 rounded-xl mx-auto  p-6'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='text-center text-gray-400 md:text-3xl'>
              <div className='h-10 w-20 bg-gray-300 rounded-full mx-auto mb-2'></div>
              <div className='h-4 w-40 bg-gray-300 rounded mx-auto'></div>
            </div>
          ))}
        </div>

        <div className='mt-8 mx-auto max-w-7xl'>
          <div className='h-20 w-full animate-pulse rounded-xl bg-gray-500 grid grid-cols-4 gap-4 p-4'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex justify-center items-center">
                <div className="h-12 w-12 rounded-full bg-gray-400"></div>
              </div>
            ))}
          </div>
        </div>

        <div className='md:w-[80%] text-white mx-auto rounded-xl mt-10 animate-pulse'>
          {/* Header Skeleton */}
          <div className='text-lg font-extralight flex flex-wrap justify-between items-center mx-auto px-4 md:px-[%] gap-4 bg-white bg-opacity-5 p-4 rounded-xl'>
            {[...Array(5)].map((_, index) => (
              <div key={index} className='h-6 w-[15%] bg-gray-300 rounded'></div>
            ))}
            {[...Array(2)].map((_, index) => (
              <div key={index} className='w-full md:w-[15%] h-10 bg-gray-300 rounded-lg'></div>
            ))}
          </div>

          {/* About Section Skeleton */}
          <div className='mt-5 px-10 md:flex md:justify-between items-center'>
            <div className='md:w-[45%]'>
              <div className='h-6 w-[50%] bg-gray-300 rounded mb-4'></div>
              <div className='h-8 w-[70%] bg-gray-300 rounded mb-10'></div>
              <div className='h-6 w-[30%] bg-gray-300 rounded mb-4'></div>
              <div className='h-[40vh] bg-gray-300 rounded'></div>
            </div>

            {/* Feature Section Skeleton */}
            <div className='flex flex-col justify-between items-center py-4 space-y-8 p-4 bg-gray-300 rounded-3xl mt-10 md:mt-0 w-[30%] md:mx-[-3%]'>
              {[...Array(4)].map((_, index) => (
                <div key={index} className='w-[100%]'>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-gray-400 rounded-xl p-3 h-10 w-10'></div>
                    <div className='w-[100%]'>
                      <div className='h-6 w-[50%] bg-gray-400 rounded mb-2'></div>
                      <div className='h-4 w-[70%] bg-gray-400 rounded'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content Skeleton */}
          <div className='my-[10%] px-10'>
            <div className='md:w-[70%]'>
              <div className='h-6 w-[40%] bg-gray-300 rounded mb-4'></div>
              <div className='h-8 w-[70%] bg-gray-300 rounded mb-6'></div>
            </div>
            <div className='md:flex items-center mt-5'>
              <ul className='flex-wrap list-inside list-disc flex gap-5 md:gap-20 md:justify-evenly'>
                {[...Array(4)].map((_, index) => (
                  <div key={index} className='h-6 w-[15%] bg-gray-300 rounded mb-2'></div>
                ))}
              </ul>
            </div>

            {/* Section Accordions Skeleton */}
            <div className='flex justify-between items-center mt-5 bg-gray-400 bg-opacity-40 rounded-2xl p-4'>
              <div className='flex flex-col items-center space-y-4 w-full'>
                {[...Array(3)].map((_, index) => (
                  <div key={index} className='w-full'>
                    <div className='flex items-center cursor-pointer p-4 bg-gray-300 rounded-lg mb-4'>
                      <div className='h-6 w-6 bg-gray-400 rounded-full mr-2'></div>
                      <div className='h-6 w-[50%] bg-gray-400 rounded'></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz Section Skeleton */}
          <div className='my-10 shadow-2xl rounded-lg p-8 text-center'>
            <div className='h-8 w-[70%] mx-auto bg-gray-400 rounded mb-6'></div>
            <div className='h-6 w-[50%] mx-auto bg-gray-300 rounded mb-4'></div>
            <div className='flex items-center justify-center space-x-4 mt-6'>
              <div className='h-10 w-[30%] bg-gray-400 rounded-full'></div>
              <div className='h-10 w-[30%] bg-gray-300 rounded-full'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCourseShimmer;
