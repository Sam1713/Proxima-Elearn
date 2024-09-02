import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';

function AdminLoginLayout() {
  return (
    <div className='w-full min-h-screen' style={{ background: 'linear-gradient(to right, #d1d1d1, #333333)' }}>
      <AdminHeader />
      <div className=''>
        <Outlet />
      </div>
    </div> 
  );
}

export default AdminLoginLayout;