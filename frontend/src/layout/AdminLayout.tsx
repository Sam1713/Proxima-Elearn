import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  const location = useLocation();

  const showSidebar = !location.pathname.startsWith('/admin/tutorCourseDetail/');

  return (
    <div className='w-full min-h-screen' style={{ background: 'linear-gradient(to right, #d1d1d1, #333333)' }}>
      <AdminHeader />
      <div className='md:w-full md:flex'>
        {showSidebar && <AdminSidebar />}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
