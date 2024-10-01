import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentProfile from '../components/studentAuth/StudentProfile';
const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex w-[100%] min-h-screen bg-custom-gradient">
      <StudentProfile isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="bg-custom-gradient rounded-xl md:mt-20 md:w-[80%] md:ml-[20%] ">        <Outlet /> {/* Renders the matched child route */}
      </main>
    </div>
  );
}; 

export default Layout;
