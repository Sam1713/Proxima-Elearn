// // import React, { useContext, useEffect } from 'react';
// // import { SocketContext } from '../context/RoomContext';
// // import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop } from 'react-icons/fa';

// // const VideoPlayer = () => {
// //   const {
// //     call,
// //     callAccepted,
// //     myVideo,
// //     userVideo,
// //     stream,
// //     callEnded,
// //     name,
// //     shareScreen,
// //     toggleVideo,
// //     toggleAudio,
// //     videoEnabled,
// //     audioEnabled,
// //   } = useContext(SocketContext) || {}; // Fallback to empty object if context is null
  
// //   if (!call && !stream) {
// //     return <div>Loading...</div>;
// //   }
  

// //   useEffect(() => {
// //     if (myVideo.current && stream) {
// //       myVideo.current.srcObject = stream;
// //     }
// //   }, [stream]);

// //   useEffect(() => {
// //     if (callAccepted && !callEnded && call && userVideo.current) {
// //       console.log('haaa')
// //       userVideo.current.srcObject = call.stream;
// //     } else {
// //       console.log('Call or stream is not available');
// //     }
// //   }, [callAccepted, callEnded,call]);

// //   return (
// //     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
// //       <div className="flex justify-around w-full max-w-5xl mb-8">
// //         <div className="relative">
// //           <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
// //             My Video: {name}
// //           </h2>
// //           <video
// //             ref={myVideo}
// //             className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
// //             playsInline
// //             autoPlay
// //           />
// //         </div>
// //         {callAccepted && !callEnded && (
// //           <div className="relative">
// //             <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
// //               User Video: {call?.name || 'User'}
// //             </h2>
// //             <video
// //               ref={userVideo}
// //               className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
// //               playsInline
// //               autoPlay
// //             />
// //           </div>
// //         )}
// //       </div>

// //       <div className="flex space-x-4">
// //         <button
// //           onClick={toggleAudio}
// //           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
// //           title={audioEnabled ? 'Mute' : 'Unmute'}
// //         >
// //           {audioEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
// //         </button>
// //         <button
// //           onClick={toggleVideo}
// //           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
// //           title={videoEnabled ? 'Stop Video' : 'Start Video'}
// //         >
// //           {videoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
// //         </button>
// //         <button
// //           onClick={shareScreen}
// //           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
// //           title="Share Screen"
// //         >
// //           <FaDesktop size={24} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoPlayer;

// import React, { useContext, useEffect, useRef } from 'react';
// import { SocketContext } from '../context/RoomContext';
// import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop } from 'react-icons/fa';

// const VideoPlayer = () => {
//   const {
//     call,
//     callAccepted,
//     myVideo,
//     userVideo,
//     stream,
//     callEnded,
//     name,
//     shareScreen,
//     toggleVideo,
//     toggleAudio,
//     videoEnabled,
//     audioEnabled,
//   } = useContext(SocketContext) || {}; // Ensure context is always valid

//   // Handle loading state
//   if (!call && !stream) {
//     return <div>Loading...</div>;
//   }

//   useEffect(() => {
//     if (myVideo.current && stream) {
//       myVideo.current.srcObject = stream;
//     }
//   }, [stream]);

//   useEffect(() => {
//     if (callAccepted && !callEnded && call && userVideo.current) {
//       userVideo.current.srcObject = call.stream;
//     }
//   }, [callAccepted, callEnded, call]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <div className="flex justify-around w-full max-w-5xl mb-8">
//         <div className="relative">
//           <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
//             My Video: {name}
//           </h2>
//           <video
//             ref={myVideo}
//             className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
//             playsInline
//             autoPlay
//           />
//         </div>
//         {callAccepted && !callEnded && (
//           <div className="relative">
//             <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
//               User Video: {call?.name || 'User'}
//             </h2>
//             <video
//               ref={userVideo}
//               className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
//               playsInline
//               autoPlay
//             />
//           </div>
//         )}
//       </div>

//       <div className="flex space-x-4">
//         <button
//           onClick={toggleAudio}
//           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
//           title={audioEnabled ? 'Mute' : 'Unmute'}
//         >
//           {audioEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
//         </button>
//         <button
//           onClick={toggleVideo}
//           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
//           title={videoEnabled ? 'Stop Video' : 'Start Video'}
//         >
//           {videoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
//         </button>
//         <button
//           onClick={shareScreen}
//           className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
//           title="Share Screen"
//         >
//           <FaDesktop size={24} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;


import React, { useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../context/RoomContext';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop } from 'react-icons/fa';

const VideoPlayer = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    callEnded,
    name,
    shareScreen,
    toggleVideo,
    toggleAudio,
    videoEnabled,
    audioEnabled,
  } = useContext(SocketContext) || {}; // Ensure context is always valid

  // Handle loading state
  if (!call && !stream) {
    return <div>Loading...</div>;
  }

  // Set up video stream for myVideo
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  // Set up video stream for userVideo
  useEffect(() => {
    if (callAccepted && !callEnded && call && userVideo.current) {
      userVideo.current.srcObject = call.stream;
    }
  }, [callAccepted, callEnded, call]);


  if (!stream) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex justify-around w-full max-w-5xl mb-8">
        <div className="relative">
          <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
            My Video: {name}
          </h2>
          <video
            ref={myVideo}
            className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
            playsInline
            autoPlay
          />
        </div>
        {callAccepted && !callEnded && (
          <div className="relative">
            <h2 className="absolute top-2 left-2 text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
              User Video: {call?.name || 'User'}
            </h2>
            <video
              ref={userVideo}
              className="w-full max-w-md h-auto rounded-lg border-4 border-gray-700"
              playsInline
              autoPlay
            />
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={toggleAudio}
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
          title={audioEnabled ? 'Mute' : 'Unmute'}
        >
          {audioEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
          title={videoEnabled ? 'Stop Video' : 'Start Video'}
        >
          {videoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </button>
        <button
          onClick={shareScreen}
          className="p-3  bg-gray-800 rounded-full hover:bg-gray-700"
          title="Share Screen"
        >
          <FaDesktop size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
