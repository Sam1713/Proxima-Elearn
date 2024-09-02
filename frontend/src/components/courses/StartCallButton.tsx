// StartCallButton.js
import React, { useContext, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Link } from 'react-router-dom';
const socket = io('http://localhost:3000');


function StartCallButton() {
  const navigate=useNavigate()
  const currentTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
  const bookingDetails=useSelector((state:RootState)=>state.tutor.bookingDetails)
  console.log('book',bookingDetails)
  console.log('curr',currentTutor?._id)
  const id=currentTutor?._id
 
  const handleNavigate=()=>{
    

   navigate(`/room/${id}`)
  }

  return (
    <div>
      {/* <a href="/room" 
      className='bg-pink-600 text-white hover:bg-pink-700 transition duration-300"
'
      >Start</a> */}
      {/* <Link to="/room/:id">Start</Link> */}
      <Button
      onClick={handleNavigate}
        className="bg-pink-600 text-white hover:bg-pink-700 transition duration-300"
        
      >
        Start Video Call
      </Button>
    </div>
  );
}

export default StartCallButton;
