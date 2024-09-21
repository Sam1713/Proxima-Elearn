import React, { useState, useContext, useEffect } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PhoneIcon, PhoneXMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { SocketContext } from '../context/RoomContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../API/Api'
import Swal from 'sweetalert2'; // Import Swal from SweetAlert2
import { setBookingDetails } from '../../redux/tutor/tutorSlice';
import { useNavigate } from 'react-router-dom';

const Options = ({ children, tutorId }) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser,myVideo } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const [copiedText, setCopiedText] = useState(''); // State to manage the copied text
    const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
    const id = currentTutor?._id;
   const navigate=useNavigate()
    const bookingDetails=useSelector((state:RootState)=>state.tutor.bookingDetails)
  console.log('book',bookingDetails?._id)
  const bookingId=bookingDetails?._id
  const dispatch=useDispatch()
    const handleCallUser = () => {
        if (idToCall) {
            callUser(idToCall);
        } else {
            console.error('No ID provided to call');
        }
    };

    const handleSend = async (id: string) => {
        Swal.fire({
            title: 'Submitting...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Show loading spinner when the popup opens
            },
        });
    
        try {
            const response = await api.post('/backend/contact/sendId', { callId: idToCall }, {
                headers: { 'X-Token-Type': 'tutor' },
                params: { id },
            });
    
            Swal.fire('Success!', 'ID has been sent successfully.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to send the ID.', 'error');
        }
    };
    
    

    const handleLeave=async(id:string)=>{
        console.log('leaving...');
        const response=await api.get('/backend/contact/leavecall',{
            headers:{
                'X-Token-Type':'tutor'
            },
            params:{
                id:id
            }
        })
        console.log('res',response)
        dispatch(setBookingDetails(response.data))
        navigate('/getCallList')
        leaveCall();

        
    }
    const handleLeaveStudent=()=>{
        navigate('/feedHome')
        leaveCall()
    }


    useEffect(() => {
        console.log('me', me);
    }, [me]);


    
    return (
        <div className="bg-gray-900">
            <div className="max-w-xl mx-auto bg-custom-gradient p-4 shadow-2xl rounded-xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-semibold">Account Info</Typography>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <CopyToClipboard 
                                text={me} 
                                onCopy={(text, result) => {
                                    if (result) {
                                        setCopiedText(text);
                                    }
                                }}
                            >
                                <Button variant="gradient" color="blue" fullWidth className="mt-4 flex items-center justify-center">
                                    <ClipboardIcon className="w-5 h-5 mr-2" />
                                    Copy Your ID
                                </Button>
                            </CopyToClipboard>
                            {copiedText && <p className="text-green-500 mt-2">Copied: {copiedText}</p>}
                        </div>
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-semibold">Action</Typography>
                            <input
                                type="text"
                                placeholder={tutorId === id ? "ID to send" : "ID to call"}
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {tutorId === id ? (
                                callAccepted && !callEnded ? (
                                    <Button
                                    onClick={()=>handleLeave(bookingId)}
                                        variant="gradient"
                                        color="red"
                                        fullWidth
                                        className="mt-4 flex items-center justify-center"
                                    >
                                        <PhoneXMarkIcon className="w-5 h-5 mr-2" />
                                        Hang Up
                                    </Button>
                                ) : (
                                    <Button
                                        variant="gradient" 
                                        color="blue"
                                        fullWidth
                                        className="mt-4 flex items-center justify-center"
                                        onClick={()=>handleSend(bookingId)}
                                    >
                                        Send
                                    </Button>
                                )
                            ) : (
                                <>
                                    {callAccepted && !callEnded ? (
                                        <Button
                                        onClick={handleLeaveStudent}
                                            variant="gradient"
                                            color="red"
                                            fullWidth
                                            className="mt-4 flex items-center justify-center"
                                            // onClick={leaveCall}
                                        >
                                            <PhoneXMarkIcon className="w-5 h-5 mr-2" />
                                            Hang Up
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="gradient"
                                            color="green"
                                            fullWidth
                                            className="mt-4 flex items-center justify-center"
                                            onClick={handleCallUser}
                                        >
                                            <PhoneIcon className="w-5 h-5 mr-2" />
                                            Call
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </form>
                {children}
            </div>
        </div>
    );
};

export default Options;
