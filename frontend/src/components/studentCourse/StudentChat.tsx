import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import StudentChatTutors from './StudentChatTutors';
import { Button } from '@material-tailwind/react';
import { IoSend } from 'react-icons/io5';
import api from '../API/Api';
import { resetMessageNotification, setMessageNotification, setRecieverIds, setUnreadMessagesRedux } from '../../redux/student/studentSlice';
import MessageNotification from '../studentNotification/MessageNotification';
import { RootState } from '../../redux/store';

const socket = io('http://localhost:3000');  // Replace with your server URL
interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  senderType: string;
}
const StudentChat: React.FC = () => {
  const [tutorList, setTutorList] = useState<[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();
  const { orderedCourseDetail } = location.state || {};
  const tutorId = orderedCourseDetail?.courseDetail?.tutorDetails.tutorId;
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const studentId = currentStudent?._id;
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [skip, setSkip] = useState<number>(0);  
  const limit:number = 12; 
  const [loading, setLoading] = useState<boolean>(false);  
  const [unreadMessages, setUnreadMessages] = useState<{ [tutorId: string]: boolean }>({});
  const [receiverId,setReceiverId]=useState<string>('')
  const [instantMessage,setInstatnMessage]=useState<string>('')
  const unreadMessagesCountRef = useRef<number>(0); 
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); 


  const dispatch=useDispatch()
  useEffect(() => {
    fetchTutorList();
  }, []);

  const fetchTutorList = async () => {
    try {
      const response = await api.get('/backend/chat/getTutorList', {
        headers: {
          'X-Token-Type': 'student',
        },
      });
      console.log('blankcheck',response.data)
      setTutorList(response.data);
      setFilteredTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutor list', error);
    }
  };

  useEffect(() => {
    if (selectedTutorId) fetchOldChats(selectedTutorId, skip);
  }, [selectedTutorId, skip]);
  
  const fetchOldChats = async (tutorId: string, skipAmount: number) => {
    setLoading(true);
    try {
      const response = await api.get('/backend/chat/getOldChats', {
        headers: {
          'X-Token-Type': 'student',
        },
        params: { tutorId, limit, skip: skipAmount },
      });
      console.log('rss',response)
      setChatMessages((prevMessages) => [...response.data.chats.reverse(), ...prevMessages]);
      fetchTutorList()
    } catch (error) {
      console.error('Error fetching old chats', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('msf',chatMessages)
  console.log('tut',tutorId)
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        senderId: studentId,
        receiverId: selectedTutorId,
        message,
        createdAt: new Date().toISOString(),
        senderType: 'student'
      };
  
      socket.emit('sendMessage', newMessage);
      api.post('/backend/chat/sendMessage', newMessage, {
        headers: {
          'X-Token-Type': 'student',
        },
        params: { tutorId: tutorId },
      })
        .then(() => {
          setChatMessages((prevMessages) => [...prevMessages , newMessage]); 
          setMessage('');
          setUnreadMessages({
            [newMessage.receiverId]: false
          });
          fetchTutorList()
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };

  useEffect(() => {
    console.log('Listening for incoming messages...');
  

    const handleReceiveMessage = (newMessage: { receiverId: React.SetStateAction<string>; senderId: string; message: React.SetStateAction<string>; }) => {
      console.log('Received message:', newMessage);
      
      if (newMessage.receiverId === studentId) {
          if (newMessage.senderId === selectedTutorId) {
            setUnreadMessagesCount(unreadMessagesCountRef.current); // Sync UI

              console.log('Message from tutor:', newMessage);
              setChatMessages((prevMessages) => [...prevMessages, newMessage]);
              setUnreadMessages((prev) => ({
                  ...prev,
                  [newMessage.senderId]: false, 
              }));
              dispatch(setUnreadMessagesRedux({ tutorId: newMessage.senderId, isUnread: false }));

          } else {
            let count=0
            setUnreadMessagesCount(unreadMessagesCountRef.current); // Sync UI

              setInstatnMessage(newMessage.message)
              dispatch(setMessageNotification(1))
              setReceiverId(newMessage.receiverId)
              setUnreadMessages((prev) => ({
                  ...prev,
                  [newMessage.senderId]: true, 
              }));
              dispatch(setRecieverIds(newMessage.receiverId))
              dispatch(setUnreadMessagesRedux({ tutorId: newMessage.senderId, isUnread: true }));
            }
      } else {
                  console.log('Message not for the selected student.');
      }
  };
  
    socket.on('receiveMessage', handleReceiveMessage);
  
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [selectedTutorId, studentId]);
  
  
  const handleTutorSelection = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    unreadMessagesCountRef.current = 0; 
  };

  

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !loading) {
      setSkip((prevSkip) => prevSkip + limit);  
    }
  };

  const handlePass = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    setSkip(0); 
    setChatMessages([]);  

    setUnreadMessages({tutorId:false})
    dispatch(setUnreadMessagesRedux({ tutorId, isUnread: false }))  };

  return (
    <div className='bg-custom-gradient pt-[5%] flex w-full'>

      <StudentChatTutors
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTutors={filteredTutors}
        handlePass={handlePass}
        unreadMessages={unreadMessages}  
        receiverId={receiverId}
        instantMessage={instantMessage}
        />
      <div className='flex-grow mx-2 mt-2 h-[89vh] flex flex-col shadow-2xl rounded-lg'>
        <div className='flex items-center justify-between p-5 bg-white bg-opacity-20 shadow-2xl text-white rounded-t-lg shadow-md'>
          <h1 className='text-lg font-bold'>Chat with Tutor</h1>
        </div>
        <div
  className="chat-box flex-grow p-4 overflow-y-auto flex flex-col custom-scrollbar bg-white bg-opacity-10"
  onScroll={handleScroll}
>
  {chatMessages.map((msg, index) => (
    <div
      key={index}
      className={`flex mb-4 ${msg.senderType==='student'? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg shadow-md ${
          msg.senderType === 'student' ? 'bg-blue-500 text-white justify-start' : 'bg-gray-300 text-black justify-start'
        }`}
      >
        <p className="text-sm">{msg?.message}</p>
        <span className="text-xs text-gray-400 block mt-1">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  ))}
          {loading && <p className='text-center'>Loading...</p>}
        </div>
        <div className='py-1 rounded-xl rounded-b-lg flex'>
          <input
            type='text'
            placeholder='Type message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='flex-grow p-3 bg-white border border-gray-900 rounded-l-lg transition duration-300'
          />
          <Button
            onClick={sendMessage}
            className='bg-blue-500 text-white px-5 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300 shadow-lg'
          >
            <IoSend />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default StudentChat;
