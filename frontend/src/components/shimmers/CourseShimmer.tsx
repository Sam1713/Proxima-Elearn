import React from 'react'
import { Button, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
const CourseShimmer = () => {
  return (
    <div className="bg-black py-16  min-h-screen p-8">
    <h1 className='text-white text-3xl mb-8'>All Courses</h1>
    <div className='bg-black text-white rounded-2xl p-4 md:w-full w-[100%]  mt-10 md:mt-0 hover:shadow-2xl transition-shadow duration-300 cursor-pointer'>
    <div className=' grid grid-cols-2 w-[100%] p-10 mx-auto md:grid-cols-4 gap-2'>
      {[...Array(8)].map((_, index) => (
        <Card key={index} color='gray' className="w-[100%] p-0 mx-auto relative overflow-hidden">
          <div className="shimmer-wrapper">
            <div className="shimmer"></div>
          </div>
          <CardHeader shadow={false} floated={false} className=" h-[20vh] relative object-cover rounded-2xl mb-4 bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-12 w-12 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </CardHeader>
          <CardBody>
          <Typography
      as="div"
      variant="paragraph"
      className="mb-2 h-2 w-full rounded-full bg-gray-300"
    >
      &nbsp;
    </Typography>
    <Typography
      as="div"
      variant="paragraph"
      className="mb-2 h-2 w-20 rounded-full bg-gray-300"
    >
      &nbsp;
    </Typography>              </CardBody>
          <CardFooter className="pt-0">
            <Button disabled tabIndex={-1} className="shimmer-item h-8 w-20 bg-gray-300 shadow-none"></Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </div>
  </div>
  )
}

export default CourseShimmer
