import React, { useEffect, useState } from 'react';
import newImage from '../../assets/images/1000_F_392072816_sO8hOPXhrlg3fELAdmWrLIJyw5dLKWu2.jpg';
import Modal from '../../modals/PostModal'; // Import your modal component
import RecentFeed from './RecentFeed';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeed, setFeeds } from '../../redux/feed/feedSlice';
import { setLoading, setLoadingClose, signout } from '../../redux/student/studentSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../API/Api'
import { AppDispatch, RootState } from '../../redux/store';
import FeedShimmer from '../shimmers/FeedShimmer';
import axios from 'axios';
const FeedHome:React.FC=()=> {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const loading=useSelector((state:RootState)=>state.student.loading)
  const dispatch=useDispatch<AppDispatch>()
  const navigate=useNavigate()
 



    const fetchFeeds = async () => {
      
      try {
        dispatch(setLoading())
        const response = await api.get('/backend/feed/getFeed',{
          headers: {
            'X-Token-Type': 'student',
          },
        });
        dispatch(setLoadingClose())
        dispatch(setFeeds(response.data))
        
        console.log('Feeds response:', response.data);
      } catch (error: unknown) {
        dispatch(setLoadingClose());
        
        if (axios.isAxiosError(error)) {
          const { response } = error;
      
          if (response) {
            const { status, data } = response;
      
            if (status === 403 && data.error === 'UserBlocked') {
              dispatch(signout());
              dispatch(clearFeed());
              alert(data.message);
              localStorage.removeItem('access_token');
              navigate('/signin');
            } else {
              console.error('An error occurred:', data.message); // Log the specific message from the response
            }
          } else {
            console.error('An error occurred:', error.message); // Log the error message if no response is available
          }
        } else {
          console.error('An error occurred:', error); // Handle non-Axios errors
        }
      }
    }    
    useEffect(()=>{
      fetchFeeds()
    },[])
    
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  if(loading){
    return(
      <>
      <FeedShimmer/>
      </>
    )
  }
  return (
    <>
    <div
      className="font-poppins py-20  md:px-8 min-h-screen transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333, #4d4d4d)', // Subtle black-to-gray gradient background
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="text-white font-bold mb-0 text-center">
        <h1 className='text-3xl'>Welcome to Feeds</h1>
      </div>
      <div className='flex flex-col md:flex-row items-center bg-white bg-opacity-25 rounded-xl justify-between w-full md:text-left px-4 md:px-8 py-4'>
        <div className='md:w-1/2 p-8 rounded-lg shadow-lg'>
          <span className='text-white opacity-70 block mb-2'>
            By Thembandirsm to inspiration
          </span>
          <h1 className='text-2xl text-white font-bold mb-4'>Tutor Class!!!</h1>
          <p className='text-white opacity-80 mb-6'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className='md:w-1/2 flex justify-center md:justify-end relative'>
          <div className='relative w-full max-w-md'>
            <img 
              className='w-full h-auto object-cover border-4 border-white rounded-3xl shadow-lg'
              src={newImage}
              alt="Stylish Image"
            />
            <div className='absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-stone-900'>
              <Link to='/courses' className='text-sm font-semibold'>Get The Course!</Link>
            </div>
          </div>
        </div>
      </div>
      <div className='text-center my-10'>
        <h1 className='text-white font-bold text-2xl opacity-90 underline'>Your Recent Feeds</h1>
        
      </div>
      <RecentFeed />

      <div className='fixed bottom-4 right-4'>
        <button 
         data-twe-toggle="tooltip"
    title="Post feed"
          className='w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl'
          onClick={openModal}
        > 
          +
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} fetchFeeds={fetchFeeds} />
    </div>
     </>
  );
}

export default FeedHome;
