// // StartCallButton.js
// import React from 'react';
// import { Button } from '@material-tailwind/react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';


// const StartCallButton:React.FC=()=> {
//   const navigate=useNavigate()
//   const currentTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
//   const bookingDetails=useSelector((state:RootState)=>state.tutor.bookingDetails)
//   console.log('book',bookingDetails)
//   console.log('curr',currentTutor?._id)
//   const id=currentTutor?._id
 
//   const handleNavigate=()=>{
    

//    navigate(`/room/${id}`)
//   }

//   return (
//     <div>
//       {/* <a href="/room" 
//       className='bg-pink-600 text-white hover:bg-pink-700 transition duration-300"
// '
//       >Start</a> */}
//       {/* <Link to="/room/:id">Start</Link> */}
//       <Button
//         onClick={handleNavigate}
//         className="bg-pink-600 text-white hover:bg-pink-700 transition duration-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        
//       >
//         Start Video Call
//       </Button>
//     </div>
//   );
// }

// export default StartCallButton;


// StartCallButton.js
import React from 'react';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../API/Api'

const StartCallButton:React.FC=()=> {
  const navigate=useNavigate()
  const currentTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
  const bookingDetails=useSelector((state:RootState)=>state.tutor.bookingDetails)
  const id = bookingDetails?._id;
  console.log('id',id)
  console.log('book',bookingDetails)
  console.log('curr',currentTutor?._id)
  // const id=currentTutor?._id
  const studentId=bookingDetails?.studentId
  const handleNavigate=async()=>{
    
    const roomId = `${studentId}-${Date.now()}`
    console.log('room',roomId)
    const callId = `/videoRoom/${roomId}`;
    try {
      await api.post('/backend/contact/sendId', { callId: callId }, {
          headers: { 'X-Token-Type': 'tutor' },
          params: { id },
      });

          }catch(error){
            console.log('err',error)
          }

    navigate(callId);

  //  navigate(`/room/${id}`)
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
        className="bg-pink-600 text-white hover:bg-pink-700 transition duration-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        
      >
        Start Video Call
      </Button>
    </div>
  );
}

export default StartCallButton;
