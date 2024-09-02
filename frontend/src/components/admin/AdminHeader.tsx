import React from 'react';
import image from '../../assets/images/OIP (28).jpeg'; // Adjusted path
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Link } from 'react-router-dom';
import api from '../API/Api'
import { adminSignout } from '../../redux/admin/adminSlice';
function AdminHeader() {
  const currentAdmin=useSelector((state:RootState)=>state.admin.currentAdmin)
  const dispatch=useDispatch()
  const handleSignout=async()=>{
    localStorage.removeItem('admin_access_token');
      const response=await api.get('/backend/admin/adminSignout',{
        headers:{
          'X-Token-Type':'admin'
        }
      })
      console.log('res',response)
      dispatch(adminSignout())
  }
  return (
    <div className='w-full h-20 shadow-xl' style={{ background: 'linear-gradient(to right, #d1d1d1, #333333)' }}>
      <div className='p-4 flex justify-between items-center'>
        <div className="flex items-center">
          <img className="w-10 h-10 mx-4 rounded-full" src={image} alt="Landing" />
          <h3 className="md:w-40 text-sm font-bold text-white">Proxima E-Learn</h3>
        </div>
        <div className='px-10'>
          <ul className='flex'>
            <li className='mx-4 text-white'>Profile</li>
            <li onClick={handleSignout} className='mx-4 text-white cursor-pointer'>{currentAdmin?'Signout':'Signin'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
