/* eslint-disable @typescript-eslint/ban-ts-comment */
// import React, { createContext, useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';

// const SocketContext = createContext(null);
// const socket = io('http://localhost:3000',{autoConnect:false});

// const ContextProvider = ({ children }) => {
//   const [stream, setStream] = useState(null);
//   const [call, setCall] = useState(null);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [name, setName] = useState('');
//   const [me, setMe] = useState('');

//   const [videoEnabled, setVideoEnabled] = useState(true); // Video enabled state
//   const [audioEnabled, setAudioEnabled] = useState(true); // Audio enabled state

//   const myVideo = useRef(null);
//   const userVideo = useRef(null);
//   const connectionRef = useRef(null);

//   // useEffect(() => {
//   //   console.log('soc',socket)
//   //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//   //     .then((currentStream) => {
//   //       setStream(currentStream);
//   //       if (myVideo.current) {
//   //         myVideo.current.srcObject = currentStream;
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error('Error accessing media devices:', error);
//   //     });
//   //   console.log('started')
//   //   socket.on('me', (id) => {
//   //     console.log('me',id)
//   //     setMe(id);
//   //   });

//   //   socket.on('calluser', ({ from, name: callerName, signal }) => {
//   //     setCall({ isReceivingCall: true, from, name: callerName, signal });
//   //   });

//   //   return () => {
//   //     socket.off('me');
//   //     socket.off('calluser');
//   //   };
//   // }, []);


//   useEffect(() => {
//     socket.connect();
    
//     socket.on('connect', () => {
//       console.log('Socket connected');
//       socket.emit('me', socket.id); 
//     });

//     socket.on('me', (id) => {
//       console.log('Received my ID:', id);
//       setMe(id);
//     });
//     // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     //   .then((currentStream) => {
//     //     setStream(currentStream);
//     //     if (myVideo.current) {
//     //       myVideo.current.srcObject = currentStream;
//     //     }
//     //   });

//     const getMediaStream = async () => {
//       try {
//         const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(currentStream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = currentStream;
//         }
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//         alert('Could not access the camera or microphone. Please check your permissions and try again.');
//       }
//     };

//     getMediaStream();
   

//     socket.on('calluser', ({ from, name: callerName, signal }) => {
//       console.log('Received calluser event:', { from, name: callerName, signal });
//       setCall({ isReceivingCall: true, from, name: callerName, signal });
//     });

//     return () => {
//       console.log('Cleaning up socket listeners');
//       socket.off('me');
//       socket.off('calluser');
//     };
//   }, []);

  

  
  
//   const answerCall = () => {
//     setCallAccepted(true);
    
//     const peer = new Peer({ initiator: false, trickle: false, stream });
//     console.log('perr',peer)
    
//     peer.on('signal', (data) => {
//       socket.emit('answercall', { signal: data, to: call.from });
//     });
    
//     peer.on('stream', (currentStream) => {
//       if (userVideo.current) {
//         console.log('userC',userVideo.current)
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
//         console.log('ha')
//         userVideo.current.srcObject = currentStream;
//         console.log('fsfsdfs',userVideo.current.srcObject)
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
//     stream.getVideoTracks()[0].enabled = !videoEnabled;
//   };

//   const toggleAudio = () => {
//     setAudioEnabled((prev) => !prev);
//     stream.getAudioTracks()[0].enabled = !audioEnabled;
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

// import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';
// import Peer from 'simple-peer';

// interface SocketContextType {
//   call: CallData | null;
//   callAccepted: boolean;
//   myVideo: React.RefObject<HTMLVideoElement>;
//   userVideo: React.RefObject<HTMLVideoElement>;
//   stream: MediaStream | null;
//   name: string;
//   setName: React.Dispatch<React.SetStateAction<string>>;
//   callEnded: boolean;
//   me: string;
//   callUser: (id: string) => void;
//   leaveCall: () => void;
//   answerCall: () => void;
//   shareScreen: () => void;
//   toggleVideo: () => void;
//   toggleAudio: () => void;
//   videoEnabled: boolean;
//   audioEnabled: boolean;
// }

// interface CallData {
//   isReceivingCall: boolean;
//   from: string;
//   name: string;
//   signal: unknown;
// }

// const SocketContext = createContext<SocketContextType | null>(null);
// const socket: Socket = io(
//   window.location.hostname === 'localhost' 
//     ? 'http://localhost:3000' // Development URL
//     : 'https://proxima.ec-shop.life', // Production URL
//   { autoConnect: false }
// );
// interface ContextProviderProps {
//   children: ReactNode;
// }

// const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [call, setCall] = useState<CallData | null>(null);
//   const [callAccepted, setCallAccepted] = useState<boolean>(false);
//   const [callEnded, setCallEnded] = useState<boolean>(false);
//   const [name, setName] = useState<string>('');
//   const [me, setMe] = useState<string>('');

//   const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
//   const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

//   const myVideo = useRef<HTMLVideoElement | null>(null);
//   const userVideo = useRef<HTMLVideoElement | null>(null);
//   const connectionRef = useRef<Peer.Instance | null>(null);

//   useEffect(() => {
//     socket.connect();

//     socket.on('connect', () => {
//       console.log('Socket connected');
//       socket.emit('me', socket.id);
//     });

//     socket.on('me', (id: string) => {
//       console.log('Received my ID:', id);
//       setMe(id);
//     });

//     const getMediaStream = async () => {
//       try {
//         const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(currentStream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = currentStream;
//         }
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//         alert('Could not access the camera or microphone. Please check your permissions and try again.');
//       }
//     };

//     getMediaStream();

//     socket.on('calluser', ({ from, name: callerName, signal }: CallData) => {
//       console.log('Received calluser event:', { from, name: callerName, signal });
//       setCall({ isReceivingCall: true, from, name: callerName, signal });
//     });

//     return () => {
//       console.log('Cleaning up socket listeners');
//       socket.off('me');
//       socket.off('calluser');
//     };
//   }, []);

//   const answerCall = () => {
//     setCallAccepted(true);
    
//       // @ts-ignore

//     const peer = new Peer({ initiator: false, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('answercall', { signal: data, to: call!.from });
//     });

//     peer.on('stream', (currentStream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = currentStream;
//       }
//     });

//     peer.on('error', (err) => {
//       console.error('Peer error:', err);
//     });
//       // @ts-ignore

//     peer.signal(call!.signal);

//     connectionRef.current = peer;
//   };

//   const callUser = (id: string) => {
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
//             // @ts-ignore
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
//       if (myVideo.current) {
//         myVideo.current.srcObject = screenStream;
//       }

//       if (connectionRef.current) {
//         connectionRef.current.replaceTrack(
//           stream!.getVideoTracks()[0],
//           screenStream.getVideoTracks()[0],
//           stream!
//         );
//       }

//       setStream(screenStream);

//       screenStream.getTracks()[0].onended = () => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//           .then((currentStream) => {
//             setStream(currentStream);
//             if (myVideo.current) {
//               myVideo.current.srcObject = currentStream;
//             }

//             if (connectionRef.current) {
//               connectionRef.current.replaceTrack(
//                 screenStream.getVideoTracks()[0],
//                 currentStream.getVideoTracks()[0],
//                 stream!
//               );
//             }
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

import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';

interface SocketContextType {
  call: CallData | null;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
  shareScreen: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

interface CallData {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: unknown;
}

const SocketContext = createContext<SocketContextType | null>(null);
const socket: Socket = io(
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000' // Development URL
    : 'https://proxima.ec-shop.life', // Production URL
  { autoConnect: false }
);

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [call, setCall] = useState<CallData | null>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [me, setMe] = useState<string>('');

  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<MediaConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('me', socket.id);
    });

    socket.on('me', (id: string) => {
      console.log('Received my ID:', id);
      setMe(id);
    });

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

    socket.on('calluser', ({ from, name: callerName, signal }: CallData) => {
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
    console.log('started');
    if (!stream) {
      console.error('No stream available to answer call.');
      return;
    }
  
    if (!call) {
      console.error('No call data available to answer call.');
      return; // Safely exit if call is null
    }
  
    const peer = new Peer(); // Initialize Peer instance
    peerRef.current = peer;
  
    setCallAccepted(true);
  
    peer.on('call', (mediaConnection) => {
      mediaConnection.answer(stream); // Answer the call with the current stream
  
      mediaConnection.on('stream', (currentStream) => {
        if (userVideo.current) {
          console.log('user', userVideo.current);
          userVideo.current.srcObject = currentStream;
        } else {
          console.log('no uservideo');
        }
      });
  
      mediaConnection.on('close', () => {
        console.log('Call ended');
        setCallEnded(true);
      });
  
      connectionRef.current = mediaConnection;
    });
  
    // Signal the incoming call
    socket.emit('answercall', { signal: call.signal, to: call.from }); // Here, it's safe to access call properties
  };
  
  const callUser = (id: string) => {
    if (!stream) {
      console.error('No stream available to initiate call.');
      return;
    }

    const peer = new Peer(); // Initialize Peer instance
    peerRef.current = peer;

    peer.on('open', (peerId) => {
      socket.emit('calluser', { userToCall: id, signalData: { peerId }, from: me, name });
    });

    // Remove the unused signal parameter
    socket.once('callaccepted', () => {
      setCallAccepted(true);
      const mediaConnection = peer.call(id, stream);

      mediaConnection.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      mediaConnection.on('close', () => {
        console.log('Call ended');
        setCallEnded(true);
      });

      connectionRef.current = mediaConnection;
    });
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        cursor: true // This is where the error occurs
      } as DisplayMediaStreamOptions & { cursor: boolean }); // Use type assertion
      if (myVideo.current) {
        myVideo.current.srcObject = screenStream;
      }

      // Stop the current video track
      const videoTrack = stream?.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
      }

      setStream(screenStream);

      if (connectionRef.current) {
        const mediaConnection = connectionRef.current;
        mediaConnection.close(); // Close the current connection
        const newConnection = peerRef.current!.call(mediaConnection.peer, screenStream);

        newConnection.on('stream', (currentStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
          }
        });

        connectionRef.current = newConnection; // Update the connection reference
      }

      screenStream.getTracks()[0].onended = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
              myVideo.current.srcObject = currentStream;
            }

            if (connectionRef.current) {
              const mediaConnection = connectionRef.current;
              const newConnection = peerRef.current!.call(mediaConnection.peer, currentStream);

              newConnection.on('stream', (currentStream) => {
                if (userVideo.current) {
                  userVideo.current.srcObject = currentStream;
                }
              });

              connectionRef.current = newConnection; // Update the connection reference
            }
          });
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    if (stream) {
      stream.getAudioTracks()[0].enabled = !audioEnabled;
    }
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.close(); // Close the connection
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
    }
    window.location.reload(); // Reload the page or navigate elsewhere
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
