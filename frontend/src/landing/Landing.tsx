import React, { useState } from 'react';
import image from '../assets/images/OIP (28).jpeg';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LandingBody from './LandingBody';


function Landing() {
  const [isOpen, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle(!isOpen);
  };

  return (
    <div className='relative'>
      <header className="fixed left-0 z-10 w-full flex flex-col sm:flex-row justify-between items-center shadow-md p-4 bg-white">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center">
            <img className="w-10 h-10 mx-4" src={image} alt="Landing" />
            <h3 className="w-20 text-sm font-semibold">Proxima E-Learn</h3>
          </div>
          <div className="sm:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <nav className={`w-full ${isOpen ? 'block' : 'hidden'} sm:flex mt-4 sm:mt-0`}>
          <ul className="flex flex-col sm:flex-row justify-end w-full">
            <li className="mx-5"><a href="#home" className="hover:text-blue-500">Home</a></li>
            <li className="mx-5"><a href="#about" className="hover:text-blue-500">About</a></li>
            <li className="mx-5"><a href="#services" className="hover:text-blue-500">Services</a></li>
            <li className="mx-5"><a href="#contact" className="hover:text-blue-500">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className='pt-20'>
        <LandingBody/>
      </main>
    </div>
  );
}

export default Landing;
