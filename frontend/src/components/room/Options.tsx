import React, { useState, useContext, useEffect } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PhoneIcon, PhoneXMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { SocketContext } from '../context/RoomContext'; // Ensure this is your context file
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../API/Api';
import Swal from 'sweetalert2'; 
import { setBookingDetails } from '../../redux/tutor/tutorSlice';
import { useNavigate } from 'react-router-dom';

// Define types directly in the file
interface SocketContextType {
    me: string;
    callAccepted: boolean;
    name: string;
    setName: (name: string) => void;
    callEnded: boolean;
    leaveCall: () => void;
    callUser: (id: string) => void;
    myVideo: HTMLVideoElement | null;
}

interface OptionsProps {
    children: React.ReactNode;
    tutorId: string;
}

const Options: React.FC<OptionsProps> = ({ children, tutorId }) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext) as unknown as SocketContextType;

    // Local state
    const [idToCall, setIdToCall] = useState<string>(''); // ID to call
    const [copiedText, setCopiedText] = useState<string>(''); // Copied text
    const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
    const id = currentTutor?._id;
    const navigate = useNavigate();
    const bookingDetails = useSelector((state: RootState) => state.tutor.bookingDetails);
    const bookingId = bookingDetails?._id;
    const dispatch = useDispatch();

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
            await api.post('/backend/contact/sendId', { callId: idToCall }, {
                headers: { 'X-Token-Type': 'tutor' },
                params: { id },
            });

            Swal.fire('Success!', 'ID has been sent successfully.', 'success');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire('Error', 'Failed to send the ID.', 'error');
        }
    };

    const handleLeave = async (id: string) => {
        console.log('leaving...');
        const response = await api.get('/backend/contact/leavecall', {
            headers: {
                'X-Token-Type': 'tutor'
            },
            params: {
                id: id
            }
        });
        console.log('res', response);
        dispatch(setBookingDetails(response.data));
        navigate('/getCallList');
        leaveCall();
    }

    const handleLeaveStudent = () => {
        navigate('/feedHome');
        leaveCall();
    };

    useEffect(() => {
        console.log('me', me);
    }, [me]);

    return (
        <div className="bg-gray-900">
            <div className="max-w-xl mx-auto bg-custom-gradient p-4 shadow-2xl rounded-xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-semibold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Account Info</Typography>
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
                                <Button variant="gradient" color="blue" fullWidth className="mt-4 flex items-center justify-center" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  placeholder={undefined}>
                                    <ClipboardIcon className="w-5 h-5 mr-2" />
                                    Copy Your ID
                                </Button>
                            </CopyToClipboard>
                            {copiedText && <p className="text-green-500 mt-2">Copied: {copiedText}</p>}
                        </div>
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-semibold" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Action</Typography>
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
                                    onClick={() => {
                                        if (bookingId) {
                                            handleLeave(bookingId);
                                        } else {
                                            console.error('Booking ID is undefined');
                                        }
                                    }}                                        variant="gradient"
                                        color="red"
                                        fullWidth
                                        className="mt-4 flex items-center justify-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <PhoneXMarkIcon className="w-5 h-5 mr-2" />
                                        Hang Up
                                    </Button>
                                ) : (
                                    <Button
                                            variant="gradient"
                                            color="blue"
                                            fullWidth
                                            className="mt-4 flex items-center justify-center"
                                            onClick={() => {
                                                if (bookingId) {
                                                    handleSend(bookingId);
                                                } else {
                                                    console.error('Booking ID is undefined');
                                                }
                                            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
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
                                                className="mt-4 flex items-center justify-center" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <PhoneXMarkIcon className="w-5 h-5 mr-2" />
                                            Hang Up
                                        </Button>
                                    ) : (
                                        <Button
                                                    variant="gradient"
                                                    color="green"
                                                    fullWidth
                                                    className="mt-4 flex items-center justify-center"
                                                    onClick={handleCallUser}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
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
