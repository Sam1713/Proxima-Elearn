import React from 'react'
import Header from '../headers/Header'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from './AdminSidebar'

function AdminLayout() {
  return (
    <>
    <div className='w-full  min-h-screen'style={{ background: 'linear-gradient(to right, #d1d1d1, #333333)' }}>
        <AdminHeader/>
        <div className='md:w-full md:flex'>
            <AdminSidebar/>
        <Outlet/>
        </div>
        </div>
      
    </>
  )
}

export default AdminLayout
