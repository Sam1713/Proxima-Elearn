// import React, { useContext } from 'react';
// import { SocketContext } from '../context/RoomContext';
// import { Button } from '@material-tailwind/react';

// const Notification:React.FC = () => {
//   const context = useContext(SocketContext);

//   const { answerCall, call, callAccepted } = context!;

//   return (
//     <>
//       {call && call.isReceivingCall && !callAccepted && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
//           <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm mx-auto transform transition-transform duration-500 ease-in-out animate-slide-in">
//             <h1 className="text-xl font-semibold mb-4 animate-pulse">{call.name} is calling</h1>
//             <Button 
//               variant="gradient"
//               color="light-blue"
//               size="lg"
//               className="w-full animate-bounce"
//               onClick={answerCall}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
//               Answer
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Notification;
