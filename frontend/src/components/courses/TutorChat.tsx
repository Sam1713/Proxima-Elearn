import React, { useEffect, useState, useRef } from 'react';
import api from '../API/Api';
import '../../css/TutorChatCss.css';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setStudentChat } from '../../redux/tutor/tutorSlice';
import { FaComment, FaSpinner } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:3000'); 

const TutorChat:React.FC = () => {
    const [message, setMessage] = useState<string>(''); 
    const [chat, setChat] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]); 
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null); 
    const [page, setPage] = useState<number>(1); 
    const [isFetching, setIsFetching] = useState<boolean>(false); 
    const [hasMore, setHasMore] = useState<boolean>(true); 
    const studentListRef = useRef<HTMLDivElement>(null); 
    const dispatch=useDispatch()
    const chatContainerRef = useRef<HTMLDivElement>(null); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [studentChats, setStudentChats] = useState<{ [key: string]: any[] }>({});
     const [loading,setLoading]=useState<boolean>(false)
    const currentTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
    const {id}=useParams()
    const myTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
    const myTutorId = myTutor ? myTutor._id : null;   
    const [unreadMessages, setUnreadMessages] = useState<{ [tutorId: string]: boolean }>({});
    const [show,setShow]=useState<boolean>(false)
   const [recId,setRecId]=useState<string>('')
    const fetchChatMessages = async (studentId: string) => {
      console.log('st',studentId)
        try {
            setLoading(true)
            const response = await api.get('/backend/chat/getStudentChat', {
                headers: { 'X-Token-Type': 'tutor' },
                params:{
                  studentId:studentId
                } 
            });
            console.log('res',response.data)
            if (response.data && response.data.chats) {
                setLoading(false)
                setChat(response.data.chats); 
                dispatch(setStudentChat(response.data.chats))
            }   
        } catch (error) {
            setLoading(false)
            console.error('Error fetching chat messages:', error);
        }
    };

    useEffect(() => {
        fetchStudentDetails(page);
    }, [page]);

console.log('tut',id)
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);
    useEffect(() => {
        console.log('started');
      
        const handleReceiveMessage = (newMessage:{ receiverId: string; senderId: string; message: string; createdAt: string; senderType: string; }) => {
          console.log('Received message:', newMessage);
      
          // Check if the message is from the selected tutor
            
      if (newMessage.receiverId === myTutorId) {
        if (newMessage.senderId === selectedStudentId) {

            console.log('Message from tutor:', newMessage);
            setChat((prevMessages) => [...prevMessages, newMessage]);
            setUnreadMessages((prev) => ({
                ...prev,
                [newMessage.senderId]: false, 
            }));
        }else{
            setRecId(newMessage.receiverId)
        setUnreadMessages((prev) => ({
            ...prev,
            [newMessage.senderId]: true, 
            
        }));
    }
          }
        };

      
        socket.on('connect', () => {
          console.log('Connected to socket server');
        });
      
        socket.on('receiveMessage', handleReceiveMessage);
      
        return () => {
          socket.off('receiveMessage', handleReceiveMessage);
        };
      }, [socket, selectedStudentId]);
      
    const sendMessage = async (selectedStudentId: string) => {
        if (!selectedStudentId) {
            alert('Please select a student to chat with.');
            return;
        }
        
        const newMessage = { 
            senderId: currentTutor?._id,
            receiverId: selectedStudentId,
            message,
            createdAt: new Date().toISOString(),
            senderType: 'tutor'
        };
    
        socket.emit('sendMessage', newMessage); // Emit message to WebSocket
    
        try {
            await api.post('/backend/chat/sendMessageToStudent', newMessage, {
                headers: {
                    'X-Token-Type': 'tutor',
                },
                params: { studentId: selectedStudentId },
            });
    
            setChat((prevMessages) => [...prevMessages, newMessage]);
    
            setStudents((prevStudents) => {
                const studentIndex = prevStudents.findIndex(student => student._id === selectedStudentId);
                if (studentIndex !== -1) {
                    const updatedStudent = {
                        ...prevStudents[studentIndex],
                        latestMessage: newMessage.message,
                        createdAt: new Date(newMessage.createdAt) 
                    };
            
                    const updatedStudents = [
                        updatedStudent,
                        ...prevStudents.filter((_, index) => index !== studentIndex)
                    ];
            
                    return updatedStudents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }
                return prevStudents;
            });
            
    
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
     
console.log('cha',chat)
    const fetchStudentDetails = async (page: number) => {
        try {
            console.log('started')
            const response = await api.get(`backend/chat/getStudentDetails?page=${page}&limit=12`, {
                headers: { 'X-Token-Type': 'tutor' },
            });
            if (response.data && response.data.students) {
                console.log('re',response.data)

                setStudents((prevStudents) => [...prevStudents, ...response.data.students]);
                setHasMore(response.data.students.length > 0); 
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        } finally {
            setIsFetching(false); // Stop fetching
        }
    };

   
    
  
    // Handle infinite scroll for student list
    const handleScroll = () => {
        const scrollableElement = studentListRef.current;
        console.log('scrEle',scrollableElement)
        if (scrollableElement) {
            const scrollTop = scrollableElement.scrollTop;
            console.log('top',scrollTop)
            const scrollHeight = scrollableElement.scrollHeight;
            console.log('hei',scrollHeight);
            
            const clientHeight = scrollableElement.clientHeight;
            console.log('client',clientHeight)

            // Trigger pagination when the user scrolls near the bottom of the sidebar
            if (scrollTop + clientHeight >= scrollHeight - 5 && !isFetching && hasMore) {
                setIsFetching(true);
                setPage((prevPage) => prevPage + 1); // Load next page
            }
        }
    };

    useEffect(() => {
        const scrollableElement = studentListRef.current;
        if (scrollableElement) {
            scrollableElement.addEventListener('scroll', handleScroll);
            return () => scrollableElement.removeEventListener('scroll', handleScroll);
        }
    }, [isFetching, hasMore]);

   
  
  

    // Handle student click to load chat
    const handleGetChats = (studentId: string) => {
        setSelectedStudentId(studentId);
        fetchChatMessages(studentId);
        setUnreadMessages((prev) => ({
            ...prev,
            [studentId]: false, 
        }));
        setShow(true)
    };

    return (
        <div className="bg-gray-100 pt-20 w-full flex">
            {/* Sidebar for chat participants */}
            <div
                className={`md:w-[25%] ${show?'hidden':'block'} md:block hidde w-full bg-white shadow-lg p-4 rounded-lg h-[600px] overflow-y-auto`} // Ensure container has defined height and allows scrolling
                ref={studentListRef} // Reference for the scrollable div
            >
                <h1 className="text-gray-900 text-lg font-semibold mb-4">Participants</h1>
                <ul className="text-gray-900 bg-gray-900 rounded-xl">
    {students
        .sort((a, b) => {
            // Sort by unread messages (move students with unread messages to the top)
            const aIsUnread = unreadMessages[a._id] === true;
            const bIsUnread = unreadMessages[b._id] === true;
            
            if (aIsUnread && !bIsUnread) return -1; // a comes before b
            if (!aIsUnread && bIsUnread) return 1;  // b comes before a
            return 0; // Keep the original order if both are same
        })
        .map((student, index) => {
            const isUnread = unreadMessages[student._id] === true; // Check for unread message for the student

            return (
                <li
                    onClick={() => handleGetChats(student._id)}
                    key={index}
                    className="mb-3 hover:bg-indigo-400 hover:text-black text-white cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                >
                    <div className="flex justify-between font-protest items-center">
                        <span>{student.username}</span>
                        <span className="text-sm text-gray-400">
                            {student.latestMessage ? new Date(student.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }) : 'No messages'}
                        </span>
                    </div>
                    <p className="text-gray-300 font-poppins text-sm">
                        {isUnread && recId == myTutorId
                            ? <span style={{ color: 'red', fontWeight: 'bold' }}>
                                🔔 You have an unread message!
                              </span>
                            : student?.latestMessage
                                ? student.latestMessage
                                : 'No messages'
                        }
                    </p>
                    <hr />
                </li>
            );
        })}
</ul>


                {isFetching && (
                    <div className="flex justify-center items-center py-4">
                        <div className="spinner"></div>
                    </div>
                )}
                {!hasMore && !isFetching && (
                    <div className="text-center py-4 text-gray-600">
                        No more students to load.
                    </div>
                )}
            </div>

            {/* Main chat area */}
             <div className={`md:w-[80%] w-full h-[600px] mx-4 bg-gray-900 shadow-lg rounded-lg flex flex-col ${show?'block':'hidden'}`}>
                {selectedStudentId ? (
                    <>
                        {/* Chat header */}
                        <div className="bg-indigo-900 p-4 rounded-t-lg">
                            <h1 className="text-white text-lg font-bold">Chat Room</h1>
                        </div>

                        {/* Chat messages */}
                        (
        <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col relative"
        >
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaSpinner className="animate-spin text-gray-600 text-3xl" />
                </div>
            ) : (
                chat.length > 0 ? (
                    chat.map((ch, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg max-w-lg w-[40%] shadow-md ${
                                ch.senderType === 'tutor'
                                    ? 'bg-indigo-600 text-white self-end'
                                    : 'bg-gray-300 text-gray-800 self-start'
                            }`}
                        >
                            <p className="text-base">
                                <strong>{ch.senderName}</strong> {ch.message}
                            </p>
                            <span className="text-xs text-gray-500 block mt-1">
                                {new Date(ch.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </span>
                        </div>
                    ))
                ) : (
                    <h1 className="text-center m-auto text-4xl font-poppins font-bold text-gray-600">No chat found</h1>
                )
            )}
        </div>

                        {/* Message input area */}
                        <div className="bg-gray-200 p-4 rounded-b-lg flex items-center">
                            <input
                                onChange={(e) => setMessage(e.target.value)}
                                type="text"
                                value={message}
                                placeholder="Type your message..."
                                className="flex-1 text-white font-poppins p-2 bg-custom-gradient rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                onClick={() => sendMessage(selectedStudentId)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg ml-3 hover:bg-indigo-700 transition"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-800 rounded-lg">
                        <FaComment className="text-white text-5xl mb-4" />
                        <p className="text-white text-lg font-protest">Please select a student to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorChat;
