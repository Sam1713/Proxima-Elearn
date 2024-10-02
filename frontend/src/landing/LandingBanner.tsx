import React from 'react';
import { Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import { SlideUp } from '../animation/animation';
interface LandingBannerProps {
  image: string;
  title: string;
  tag?:string;
  subtitle: string;
  reverse?: boolean;
}

const LandingBanner: React.FC<LandingBannerProps> = ({ image, title,tag, subtitle, reverse = false }) => {
  return (
    <>
    <div className='bg-[#f9f9f9f] flex justify-center mx-auto p-10 '>
      <div className="">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
          {/* Image Section */}
          <div className={`flex justify-start items-center ${reverse ? 'md:order-last md:justify-end' : ''}`}>
          <motion.img
            initial={{opacity:0,scale:0.5}}
            whileInView={{opacity:1,scale:1}}
            transition={{type:"spring",stiffness:100,delay:0.2}}
            src={image} alt={title} className='md:w-[400px] h-full object-cover' />          </div>

          {/* Text Section */}
          <div className='flex flex-col justify-center text-center md:text-left space-y-4 lg:max-w-[500px]'>
          <motion.p
          variants={SlideUp(0.5)}
          initial="hidden"
          whileInView={"visible"}
           className="text-sm text-orange-600 capitalize font-semibold">{tag}</motion.p>

            <motion.p
              variants={SlideUp(0.7)}
              initial="hidden"
              whileInView={"visible"}
            className="text-xl lg:text-2xl capitalize font-semibold text-gray-400 font-protest">{title}</motion.p>
            <motion.p
              variants={SlideUp(0.9)}
              initial="hidden"
              whileInView={"visible"}
            className="text-sm text-cyan-600 font-poppins space-y-4 ">{subtitle}</motion.p>
            <motion.div
             variants={SlideUp(1.1)}
             initial="hidden"
             whileInView={"visible"}
             className='flex justify-center md:justify-start'
            >
            <Button color="blue" size="lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Learn More</Button>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default LandingBanner;
