// JoinCallButton.js
import React from 'react';
import { Button } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const JoinCallButton:React.FC=()=> {
  const navigate = useNavigate();
  const currentStudent=useSelector((state:RootState)=>state.student.currentStudent)
  console.log('curr',currentStudent?._id)
  const id=currentStudent?._id
 const handleNavigate=()=>{
  navigate(`/roomStudent/${id}`)
 }

  return (
    <div className="flex items-center">
      <Button onClick={handleNavigate}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Join Call</Button>
     
    </div>
  );
}

export default JoinCallButton;
