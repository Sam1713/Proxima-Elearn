import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import React from 'react';

const CourseDetailShimmer:React.FC = () => {
  return (
    <div className='bg-custom-gradient min-h-screen py-16'>
      <div>
      <Card className="animate-pulse bg-gray-900"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>

        <CardHeader
            shadow={false}
            floated={false}
            className="md:h-[60vh] bg-gray-400 justify-center items-center hidden md:flex"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-20 w-20 m-auto text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </CardHeader>
        </Card>
        <div className='mt-[50%] md:mt-0 md:absolute  rounded-xl right-[4%] md:transform -translate-y-1/2 p-5'>
        <Card className="w-66 animate-pulse bg-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardHeader
              shadow={false}
              floated={false}
              className="relative grid h-56 place-items-center bg-gray-900"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-12 w-12 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </CardHeader>
      <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Typography
                as="div"
                variant="h1"
                className="mb-4 h-3 w-56 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        {/* <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography> */}
        <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-full rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-full rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
      </CardBody>
      <CardFooter className="pt-0"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Button
                disabled
                tabIndex={-1}
                className="h-8 w-20 bg-gray-300 shadow-none hover:shadow-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Button>
      </CardFooter>
    </Card>
        </div>
      </div>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-20 mx-20 mt-10 animate-pulse w-[65%] rounded-xl bg-gray-500 grid grid-cols-4 gap-4 p-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  {/* Box 1 */}
  <div className="flex justify-center items-center">
    <div className="h-full w-[50%] rounded bg-gray-400"></div>
  </div>

  {/* Box 2 */}
  <div className="flex justify-center items-center">
    <div className="h-full w-[50%] rounded bg-gray-400"></div>
  </div>

  {/* Box 3 */}
  <div className="flex justify-center items-center">
    <div className="h-full w-[50%] rounded bg-gray-400"></div>
  </div>

  {/* Box 4 */}
  <div className="flex justify-center items-center">
    <div className="h-full w-[50%] rounded bg-gray-400"></div>
  </div>
</Typography>
<Typography
        as="div"
        variant="paragraph"
        className="mb-2 animate-pulse  mx-20 mt-10 h-[50vh] w-[65%] rounded-xl bg-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <div className='py-10 '>
        <div className='h-10 w-[20%] rounded-xl mx-auto    bg-gray-300'>
        </div>

        </div>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-[80%] mx-10 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-[70%] mx-10 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-10 h-3 w-[60%] mx-10 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-[80%] mx-10 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-[70%] mx-10 rounded-full bg-gray-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-[60%] mx-10 rounded-full bg-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &nbsp;
        </Typography>
      </Typography>

    </div>
  );
};

export default CourseDetailShimmer;
