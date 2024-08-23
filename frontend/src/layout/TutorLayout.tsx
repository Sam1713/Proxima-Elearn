// TutorLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TutorSidebar from './TutorSidebar';
import TutorHeader from '../headers/TutorHeader'
const TutorLayout: React.FC = () => {
  const location = useLocation();
  
  // List the paths where the sidebar should be visible
  const sidebarPaths = ['/tutorprofile','/getTutorCourses','/purchasedStudents']; // Add more paths as needed

  const showSidebar = sidebarPaths.includes(location.pathname);

  return (
    <div className='bg-custom-gradient '>
      <TutorHeader />
      <div className='md:flex'>
        {showSidebar && <TutorSidebar />} {/* Conditionally render the sidebar */}
        <div className={`w-[100%]  ${showSidebar ? 'md:pt-16 ml-[25%]' : ''}`}> {/* Adjust margin if sidebar is present */}
          <Outlet />
        </div>
      </div>
    </div>
  )
};

export default TutorLayout;
