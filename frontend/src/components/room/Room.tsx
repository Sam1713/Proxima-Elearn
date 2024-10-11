// import React from 'react';
// import { Typography } from "@material-tailwind/react";
// import VideoPlayer from './VideoPlayer';
// import Options from './Options';
// import Notification from './Notification';
// import { ContextProvider } from '../context/RoomContext';
// import { useParams } from 'react-router-dom';

// const Room:React.FC=()=> {
//   const { id } = useParams();
//   console.log('c',id)

//   return (
//     <ContextProvider>
//       <div className='pt-20'> 
//         <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Video Chat</Typography>
//         <VideoPlayer />
//         {id ? (  
//           <Options tutorId={id}>
//             <Notification />
//           </Options>
//         ) : (
//           <Typography className="text-red-500"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Invalid ID</Typography> // Optionally display a message if ID is not valid
//         )}
//       </div>
//     </ContextProvider>
//   );
// }

// export default Room;
