import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 
import img1 from '../assets/images/OIP (28).jpeg'
import img2 from '../assets/images/OIP__29_-removebg-preview.png'
import img3 from '../assets/images/e37e0e25686c2139b281a57a5b4906f2.jpg'
import img4 from '../assets/images/Online Convocation.png'
import Slider from 'react-slick';
import LandingFooter from './LandingFooter';
import '../css/sliderStyle.css'
const TestData = [
  {
    id: 1,
    name: "Sam Saju",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    img: img1,
    delay: 0.2
  },
  {
    id: 2,
    name: "Hitman A.A",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    img: img2,
    delay: 0.5
  },
  {
    id: 3,
    name: "Ajma Rauf",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    img: img3,
    delay: 0.8
  },
  {
    id: 4,
    name: "Rocky Dal",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    img: img4,
    delay: 1.1
  }
];

const LandingReview = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 6500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 5000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <div className='py-14 mb-5'>
        <div className='space-y-4 p-6 md:w-[1000px] mx-auto'>
          <div className='text-center'>
            <h1 className='uppercase font-semibold text-orange-600'>
              OUR TESTIMONIALS
            </h1>
            <p className='font-semibold text-3xl text-white'>
              What Our Students Say About Us
            </p>
          </div>
          <div>
            <Slider {...settings}>
              {TestData.map((item) => (
                <div key={item.id} className='p-4'>
                  <div className='flex flex-col gap-4 p-8 rounded-xl shadow-lg bg-blue-50'>
                    <div className='flex justify-start items-center gap-5'>
                      <img className='w-16 h-16 rounded-full' src={item.img} alt={item.name} />
                      <div>
                        <p className='text-xl font-bold text-black'>{item.name}</p>
                      </div>
                    </div>
                    <div className='py-6 space-y-4'>
                      <p className='text-sm'>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default LandingReview;
