// JoinCallButton.js
import React, { useContext } from 'react';
import { Button } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { removeRoomId } from '../../redux/room/roomSlice';

function JoinCallButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomId = useSelector((state: RootState) => state.room.roomId);
  const currentStudent=useSelector((state:RootState)=>state.student.currentStudent)
  console.log('curr',currentStudent?._id)
  const id=currentStudent?._id
 const handleNavigate=()=>{
  navigate(`/room/${id}`)
 }

  return (
    <div className="flex items-center">
      <Button onClick={handleNavigate}>Join Call</Button>
      {/* <a href="/room" 
      className='bg-pink-600 text-white hover:bg-pink-700 transition duration-300"
'
      >Join</a> */}
    </div>
  );
}

export default JoinCallButton;
