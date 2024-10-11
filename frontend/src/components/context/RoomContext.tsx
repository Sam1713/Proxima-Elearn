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
// import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';
// import Peer, { MediaConnection } from 'peerjs';

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
//   const connectionRef = useRef<MediaConnection | null>(null);
//   const peerRef = useRef<Peer | null>(null);

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
//       socket.disconnect(); // Ensure socket is disconnected on unmount
//     };
//   }, []);

//   const setupPeer = () => {
//     const peer = new Peer();
//     peerRef.current = peer;

//     peer.on('call', (mediaConnection) => {
//       console.log('Received media connection:', mediaConnection);
//       if (stream) {
//         mediaConnection.answer(stream); // Answer the call with the current stream
//         setupMediaConnection(mediaConnection);
//       }
//     });
//   };

//   const setupMediaConnection = (mediaConnection: MediaConnection) => {
//     mediaConnection.on('stream', (currentStream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = currentStream; // Set the received stream to userVideo
//       }
//     });

//     mediaConnection.on('close', () => {
//       console.log('Call ended');
//       setCallEnded(true);
//       if (userVideo.current) {
//         userVideo.current.srcObject = null; // Clear user video stream when call ends
//     }
//     });

//     connectionRef.current = mediaConnection;
//   };

//   const answerCall = () => {
//     if (!stream || !call) {
//       console.error('Stream or call data is unavailable.');
//       return; // Safely exit if stream or call is null
//     }

//     setCallAccepted(true);
//     setupPeer(); // Initialize peer and set up media connection
//     socket.emit('answercall', { signal: call.signal, to: call.from }); // Signal the incoming call
//   };

//   const callUser = (id: string) => {
//     if (!stream) {
//       console.error('No stream available to initiate call.');
//       return;
//     }

//     setupPeer();

//     peerRef.current?.on('open', (peerId) => {
//       socket.emit('calluser', { userToCall: id, signalData: { peerId }, from: me, name });
//     });

//     socket.once('callaccepted', () => {
//       console.log('Call accepted');
//       const mediaConnection = peerRef.current!.call(id, stream);
//       setupMediaConnection(mediaConnection);
//     });
//   };

//   const shareScreen = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: true
//             });

//       if (myVideo.current) {
//         myVideo.current.srcObject = screenStream;
//       }

//       // Stop the current video track
//       const videoTrack = stream?.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.stop();
//       }

//       setStream(screenStream);
//       if (connectionRef.current) {
//         const mediaConnection = connectionRef.current;
//         mediaConnection.close(); // Close the current connection
//         const newConnection = peerRef.current!.call(mediaConnection.peer, screenStream);
//         setupMediaConnection(newConnection); // Set up new connection for screen sharing
//       }

//       screenStream.getTracks()[0].onended = async () => {
//         const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(currentStream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = currentStream;
//         }

//         if (connectionRef.current) {
//           const mediaConnection = connectionRef.current;
//           const newConnection = peerRef.current!.call(mediaConnection.peer, currentStream);
//           setupMediaConnection(newConnection); // Restore original video
//         }
//       };
//     } catch (error) {
//       console.error('Error sharing screen:', error);
//     }
//   };

//   const toggleVideo = () => {
//     if (stream) {
//       // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//       videoEnabled ? stream.getVideoTracks()[0].enabled = false : stream.getVideoTracks()[0].enabled = true;
//       setVideoEnabled((prev) => !prev);
//     }
//   };

//   const toggleAudio = () => {
//     if (stream) {
//       // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//       audioEnabled ? stream.getAudioTracks()[0].enabled = false : stream.getAudioTracks()[0].enabled = true;
//       setAudioEnabled((prev) => !prev);
//     }
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     if (connectionRef.current) {
//       connectionRef.current.close(); // Close the connection
//     }
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
//     }
//     window.location.reload(); // Reload the page or navigate elsewhere
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

// Define types for context and state
interface ContextType {
  call: Call;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
}

interface Call {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: any; // PeerJS handles signaling differently
}

// Context initialization
const SocketContext = createContext<ContextType | undefined>(undefined);

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
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [name, setName] = useState<string>('');
  const [call, setCall] = useState<Call>({} as Call);
  const [me, setMe] = useState<string>('');

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<MediaConnection | null>(null);
  const peerInstance = useRef<Peer | null>(null);

  useEffect(() => {
    peerInstance.current = new Peer(); // Create a PeerJS instance
    console.log('Peer instance:', peerInstance.current);

    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('me', socket.id);
    });

    socket.on('me', (id: string) => {
      console.log('Received my ID:', id);
      setMe(id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    socket.on('calluser', ({ from, name: callerName, signal }: Call) => {
      console.log('Receiving a call from:', from);
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on('callaccepted', (signal) => {
      console.log('Call accepted with signal:', signal);
      // Use the peer instance to signal the call
      connectionRef.current?.signal(signal);
      setCallAccepted(true);
    });

    return () => {
      peerInstance.current?.destroy();
      socket.off('calluser');
      socket.off('callaccepted');
    };
  }, []);

  const answerCall = () => {
    console.log('answering')
    if (!peerInstance.current || !call.signal) return; // Check if signal exists
    setCallAccepted(true);
    
    const callInstance = peerInstance.current.call(call.from, stream); // Call with the signal
  
    callInstance.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });
  
    callInstance.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from });
    });
  
    callInstance.on('error', (err) => {
      console.error('Error in call:', err);
    });
  
    connectionRef.current = callInstance; // Store the connection reference
  };
  
  const callUser = (id: string) => {
    if (!peerInstance.current || !stream) return;

    console.log('Initiating call to user:', id);

    const call = peerInstance.current.call(id, stream);

    call.on('stream', (remoteStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    call.on('error', (err) => {
      console.error('PeerJS call error:', err);
    });

    call.on('close', () => {
      console.log('Call ended');
    });

    connectionRef.current = call;

    socket.emit('calluser', { userToCall: id, from: me });
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.close();
    peerInstance.current?.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

