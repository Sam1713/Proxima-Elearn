import { Card, Typography } from '@material-tailwind/react';
import React from 'react';

const FeedShimmer = () => {
  return (
    <div className='bg-black min-h-screen py-32'>
      {/* Main Card */}
      <Card className='animate-pulse p-4'>
        {/* Container for both typography and image */}
        <div className='flex justify-between items-center h-[50vh] w-full bg-gray-500 p-4'>
          {/* Shimmer text lines */}
          <div className='space-y-4 w-[60%] animate-pulse'>
            <div className='h-3 w-full rounded-xl bg-gray-400'></div>
            <div className='h-3 w-[80%] rounded-xl bg-gray-400'></div>
            <div className='h-3 w-[70%] rounded-xl bg-gray-400'></div>
          </div>

          {/* Right-aligned shimmer image */}
          <div className="h-[35vh] w-[30%] bg-gray-600 rounded-lg"></div>
        </div>
      </Card>

      {/* Optional Heading Shimmer */}
      <div className='w-[20%] rounded-xl animate-pulse bg-gray-500 h-10 mx-auto mt-20'></div>

      {/* Post Cards Section */}
      <div className='mt-10 space-y-6 w-[80%] mx-auto'>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className='animate-pulse p-6 h-[80vh] bg-gray-500'>
            <div className='space-y-4 w-full'>
              {/* Circular Avatar Placeholder */}
              <div className='rounded-full h-12 w-12 bg-gray-400 animate-pulse'></div>
              
              <div className='h-3 w-[90%] bg-gray-400 rounded-xl'></div>
              <div className='h-3 w-[80%] bg-gray-400 rounded-xl'></div>
              <div className='h-[55vh] bg-gray-600 rounded-lg'></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Spinner at the Bottom */}
      <div className='flex justify-center mt-12'>
  <div className='w-12 h-12 border-4 border-t-4 border-gray-300 border-opacity-50 rounded-full animate-spin'></div>
</div>

    </div>
  );
};

export default FeedShimmer;
