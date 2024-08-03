import React from 'react';
import LandingFeed from './LandingFeed';

function LandingDescription() {
  return (
    <>
    <div className='bg-gradient-to-r from-gray-800 via-black to-gray-800 w-full mx-auto'>
      <div className='w-full my-10 flex justify-center bg-gradient-to-r from-gray-800 via-black to-gray-800'>
        <h1 className='w-full md:w-1/3 text-center text-4xl font-bold text-white shadow-lg p-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full'>
          Our Success
        </h1>
      </div>
      <div className='flex justify-center'>
        <div className='text-sm w-full md:w-1/2 p-4 bg-white shadow-md rounded-lg'>
          <span className='text-center leading-relaxed'>
            Ornare id fames interdum porttitor nulla turpis etiam. Diam vitae sollicitudin at nec nam et pharetra gravida. Adipiscing a quis ultrices eu ornare tristique vel nisl orci.
          </span>
        </div>
      </div>
      <div className='flex flex-wrap justify-center mt-12 gap-28'>
        <div className='flex flex-col items-center text-gray-800'>
          <span className='text-3xl font-bold'>15k+</span>
          <span className='text-sm mt-2'>Success</span>
        </div>

        {/* Pair 2 */}
        <div className='flex flex-col items-center text-gray-800'>
          <span className='text-3xl font-bold'>75%</span>
          <span className='text-sm mt-2'>Total Success</span>
        </div>

        {/* Pair 3 */}
        <div className='flex flex-col items-center text-gray-800'>
          <span className='text-3xl font-bold'>35</span>
          <span className='text-sm mt-2'>Main Questions</span>
        </div>

        {/* Pair 4 */}
        <div className='flex flex-col items-center text-gray-800'>
          <span className='text-3xl font-bold'>25</span>
          <span className='text-sm mt-2'>Chief Experts</span>
        </div>

        {/* Pair 5 */}
        <div className='flex flex-col items-center text-gray-800'>
          <span className='text-3xl font-bold'>1+</span>
          <span className='text-sm mt-2'>Years of Experience</span>
        </div>
      </div>
     
      <div className='text-center mt-12'>
        <h1 className='text-xl md:text-4xl font-extrabold text-transparent bg-clip-text   bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg p-2 inline-block'>
          Categories
        </h1>
      </div>

      <div className='flex flex-wrap justify-center gap-12 mt-20'>
        
        {/* Web Development */}
        <div className='w-full sm:w-1/2 lg:w-1/3 p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg rounded-lg'>
          <div className='flex flex-col items-center'>
            <span className='text-2xl font-bold mb-2'>Web Development</span>
            <span className='text-sm text-center'>
              Web development involves creating and maintaining websites, focusing on both front-end (user interface) and back-end (server-side functionality).
            </span>
          </div>
        </div>

        {/* Java Programming */}
        <div className='w-full sm:w-1/2 lg:w-1/3 p-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-lg rounded-lg'>
          <div className='flex flex-col items-center'>
            <span className='text-2xl font-bold mb-2'>Java Programming</span>
            <span className='text-sm text-center'>
              Java is a versatile, high-level programming language known for its portability across platforms, thanks to the "write once, run anywhere" capability provided by the Java Virtual Machine (JVM).
            </span>
          </div>
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/3 p-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg rounded-lg'>
          <div className='flex flex-col items-center'>
            <span className='text-2xl font-bold mb-2'>Data Science</span>
            <span className='text-sm text-center'>
              Data Science involves extracting insights and knowledge from data through statistical analysis, machine learning, and data visualization.
            </span>
          </div>
        </div>

        {/* Machine Learning */}
        <div className='w-full sm:w-1/2 lg:w-1/3 p-4 bg-gradient-to-r from-indigo-400 to-teal-500 text-white shadow-lg rounded-lg'>
          <div className='flex flex-col items-center'>
            <span className='text-2xl font-bold mb-2'>Machine Learning</span>
            <span className='text-sm text-center'>
              Machine Learning is a branch of artificial intelligence that focuses on building systems that learn from data and improve over time without being explicitly programmed.
            </span>
          </div>
        </div>
      </div>
      <LandingFeed/>
      </div>
    </>
  );
}

export default LandingDescription;
