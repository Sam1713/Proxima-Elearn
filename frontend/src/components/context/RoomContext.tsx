import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext(null);
const socket = io('http://localhost:3000',{autoConnect:false});

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [me, setMe] = useState('');

  const [videoEnabled, setVideoEnabled] = useState(true); // Video enabled state
  const [audioEnabled, setAudioEnabled] = useState(true); // Audio enabled state

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  // useEffect(() => {
  //   console.log('soc',socket)
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setStream(currentStream);
  //       if (myVideo.current) {
  //         myVideo.current.srcObject = currentStream;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error accessing media devices:', error);
  //     });
  //   console.log('started')
  //   socket.on('me', (id) => {
  //     console.log('me',id)
  //     setMe(id);
  //   });

  //   socket.on('calluser', ({ from, name: callerName, signal }) => {
  //     setCall({ isReceivingCall: true, from, name: callerName, signal });
  //   });

  //   return () => {
  //     socket.off('me');
  //     socket.off('calluser');
  //   };
  // }, []);


  useEffect(() => {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('me', socket.id); 
    });

    socket.on('me', (id) => {
      console.log('Received my ID:', id);
      setMe(id);
    });
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     setStream(currentStream);
    //     if (myVideo.current) {
    //       myVideo.current.srcObject = currentStream;
    //     }
    //   });

    const getMediaStream = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access the camera or microphone. Please check your permissions and try again.');
      }
    };

    getMediaStream();
   

    socket.on('calluser', ({ from, name: callerName, signal }) => {
      console.log('Received calluser event:', { from, name: callerName, signal });
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('me');
      socket.off('calluser');
    };
  }, []);

  

  
  
  const answerCall = () => {
    setCallAccepted(true);
    
    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log('perr',peer)
    
    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from });
    });
    
    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        console.log('userC',userVideo.current)
        userVideo.current.srcObject = currentStream;
      }
    });
    
    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });
    
    peer.signal(call.signal);
    
    connectionRef.current = peer;
  };
  
  const callUser = (id) => {
    if (!stream) {
      console.error('No stream available to initiate call.');
      return;
    }
    
    const peer = new Peer({ initiator: true, trickle: false, stream });
    
    peer.on('signal', (data) => {
      socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
    });
    
    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        console.log('ha')
        userVideo.current.srcObject = currentStream;
        console.log('fsfsdfs',userVideo.current.srcObject)
      }
    });
    
    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });
    
    socket.once('callaccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    
    connectionRef.current = peer;
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
      if (myVideo.current) {
        myVideo.current.srcObject = screenStream;
      }

      connectionRef.current.replaceTrack(
        stream.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        stream
      );

      setStream(screenStream);

      screenStream.getTracks()[0].onended = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;

            connectionRef.current.replaceTrack(
              screenStream.getVideoTracks()[0],
              currentStream.getVideoTracks()[0],
              stream
            );
          });
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    stream.getVideoTracks()[0].enabled = !videoEnabled;
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    stream.getAudioTracks()[0].enabled = !audioEnabled;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      shareScreen,
      toggleVideo, 
      toggleAudio, 
      videoEnabled, 
      audioEnabled, 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };


// import React, { createContext, useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';

// const SocketContext = createContext(null);
// const socket = io('http://localhost:3000');

// const ContextProvider = ({ children }) => {
//   const [stream, setStream] = useState(null);
//   const [me, setMe] = useState('');
//   const [call, setCall] = useState(null);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [name, setName] = useState('');
//   const [videoEnabled, setVideoEnabled] = useState(true);
//   const [audioEnabled, setAudioEnabled] = useState(true);

//   const myVideo = useRef(null);
//   const userVideo = useRef(null);
//   const connectionRef = useRef(null);

//   useEffect(() => {
//     const initializeMediaAndSocket = async () => {
//       try {
//         // Fetch user media
//         const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(currentStream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = currentStream;
//         }
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
  
//       // Socket event listeners
//       try {
//         socket.on('me', (id) => {
//           console.log('Received ID from server:', id);
//           setMe(id);
//         });
  
//         socket.on('calluser', ({ from, name: callerName, signal }) => {
//           setCall({ isReceivingCall: true, from, name: callerName, signal });
//         });
//       } catch (error) {
//         console.error('Error setting up socket listeners:', error);
//       }
//     };
  
//     initializeMediaAndSocket();
  
//     return () => {
//       try {
//         socket.off('me');
//         socket.off('calluser');
//       } catch (error) {
//         console.error('Error removing socket listeners:', error);
//       }
//     };
//   }, []);
  
//   const answerCall = () => {
//     setCallAccepted(true);

//     const peer = new Peer({ initiator: false, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('answercall', { signal: data, to: call.from });
//     });

//     peer.on('stream', (currentStream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = currentStream;
//       }
//     });

//     peer.on('error', (err) => {
//       console.error('Peer error:', err);
//     });

//     peer.signal(call.signal);

//     connectionRef.current = peer;
//   };

//   const callUser = (id) => {
//     if (!stream) {
//       console.error('No stream available to initiate call.');
//       return;
//     }

//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
//     });

//     peer.on('stream', (currentStream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = currentStream;
//       }
//     });

//     peer.on('error', (err) => {
//       console.error('Peer error:', err);
//     });

//     socket.once('callaccepted', (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const shareScreen = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
//       if (myVideo.current) {
//         myVideo.current.srcObject = screenStream;
//       }

//       connectionRef.current.replaceTrack(
//         stream.getVideoTracks()[0],
//         screenStream.getVideoTracks()[0],
//         stream
//       );

//       setStream(screenStream);

//       screenStream.getTracks()[0].onended = () => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//           .then((currentStream) => {
//             setStream(currentStream);
//             myVideo.current.srcObject = currentStream;

//             connectionRef.current.replaceTrack(
//               screenStream.getVideoTracks()[0],
//               currentStream.getVideoTracks()[0],
//               stream
//             );
//           });
//       };
//     } catch (error) {
//       console.error('Error sharing screen:', error);
//     }
//   };

//   const toggleVideo = () => {
//     setVideoEnabled((prev) => !prev);
//     if (stream) {
//       stream.getVideoTracks()[0].enabled = !videoEnabled;
//     }
//   };

//   const toggleAudio = () => {
//     setAudioEnabled((prev) => !prev);
//     if (stream) {
//       stream.getAudioTracks()[0].enabled = !audioEnabled;
//     }
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     if (connectionRef.current) {
//       connectionRef.current.destroy();
//     }
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     window.location.reload();
//   };

//   return (
//     <SocketContext.Provider value={{
//       call,
//       callAccepted,
//       myVideo,
//       userVideo,
//       stream,
//       name,
//       setName,
//       callEnded,
//       me,
//       callUser,
//       leaveCall,
//       answerCall,
//       shareScreen,
//       toggleVideo,
//       toggleAudio,
//       videoEnabled,
//       audioEnabled,
//     }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { ContextProvider, SocketContext };


