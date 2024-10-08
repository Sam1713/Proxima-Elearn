import React, { useState } from 'react';
import image from '../assets/images/OIP (28).jpeg'; // Adjusted path
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { TbUserScreen } from "react-icons/tb";

import License from '../modals/tutorModal/License';
import { FaHome } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";


import api from '../components/API/Api'
import { tutorsignout } from '../redux/tutor/tutorSlice';
function TutorHeader() {
  const [isOpen, setToggle] = useState(false);
  const myTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const dispatch = useDispatch<AppDispatch>();
  const [licenseOpen, setLicenseOpen] = useState<boolean>(false);
  const val = myTutor?.license;
console.log('va',val)
  const toggleMenu = () => {
    setToggle(!isOpen);
  };

  const handleSignout = async () => {
    try {
      localStorage.removeItem('tutor_access_token');
      await api.get("/backend/tutor/tutorSignout");
      dispatch(tutorsignout());
    } catch (error) {
      console.log(error);
    }
  };

  const handleLicense = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLicenseOpen(true);
  };

  const handleLicenseClose = () => {
    setLicenseOpen(false);
  };

  return (
    <header className="fixed left-0 z-30 bg-custom-gradient h-auto w-full flex flex-col sm:flex-row justify-between items-center p-4 bg-transparent shadow-lg">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center">
          <img className="w-10 h-10 mx-4 rounded-full" src={image} alt="Landing" />
          <h3 className="md:w-40 text-sm font-bold text-white">Proxima E-Learn</h3>
        </div>
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
          </button>
        </div>    
      </div>
      <nav className={`w-full ${isOpen ? 'block' : 'hidden'} sm:flex mt-4 sm:mt-0`}>
        <ul className="flex flex-col sm:flex-row justify-end w-full  text-white">
          <li className="mx-10">
            <Link to={myTutor?'/tutorhome':'/'} className="hover:text-blue-300 transition-colors duration-300"><FaHome size={30}/></Link>
          </li>
          <li className="mx-10"> 
            <Link to='/tutorprofile' className="hover:text-blue-300 transition-colors duration-300"><TbUserScreen size={30}/></Link>
          </li>
          <li className="mx-10">
          <Link 
  to={val ? '/coursepage' : '#'}
  onClick={!val&&myTutor ? handleLicense : undefined}
  className="hover:text-blue-300 transition-colors duration-300"
>
  <FaChalkboardTeacher size={30}/>
</Link>

          </li>
          <li className="mx-10">
            <Link onClick={handleSignout} to='/tutorsignin' className="hover:text-blue-300 font-protest text-2xl transition-colors duration-300">
              {!myTutor?'Signin':'Signout'}
            </Link>
          </li>
          
        </ul>
      </nav>
      <License isOpen={licenseOpen} onClose={handleLicenseClose} licensee={val} />
    </header>
  );
}

export default TutorHeader;
