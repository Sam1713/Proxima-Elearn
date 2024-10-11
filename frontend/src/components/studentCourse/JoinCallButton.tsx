// JoinCallButton.js
import React from 'react';
import { Button } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface callIdType{
  callId:string
}
const JoinCallButton:React.FC<callIdType>=({callId})=> {
  const navigate = useNavigate();
  const currentStudent=useSelector((state:RootState)=>state.student.currentStudent)
  console.log('curr',currentStudent?._id)
  // const id=currentStudent?._id
 const handleNavigate=()=>{
  navigate(callId)
 }

  return (
    <div className="flex items-center">
    <Button 
      onClick={handleNavigate} 
      disabled={!callId}
      placeholder={undefined} 
      onPointerEnterCapture={undefined} 
      onPointerLeaveCapture={undefined}
    >
      Join Call
    </Button>
  </div>
  
  );
}

export default JoinCallButton;
