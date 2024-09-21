import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import StudentChatTutors from './StudentChatTutors';
import { Button } from '@material-tailwind/react';
import { IoSend } from 'react-icons/io5';
import api from '../API/Api';

const socket = io('http://localhost:3000');  // Replace with your server URL

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
  const [chatMessages, setChatMessages] = useState<[]>([]);
  const [skip, setSkip] = useState<number>(0);  // Tracks how many messages to skip for pagination
  const limit = 12;  // Number of messages to fetch per call
  const [loading, setLoading] = useState<boolean>(false);  // To track the loading state for pagination
  const [unreadMessages, setUnreadMessages] = useState<{ [tutorId: string]: boolean }>({});
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
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage('');
          setUnreadMessages({
            [newMessage.receiverId]: true
          });
          fetchTutorList()
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };


  useEffect(() => {
    console.log('dsfsdfs')
    socket.on('receiveMessage', (newMessage) => {
      if (newMessage.senderId === selectedTutorId) {  // Check if the message is from the selected tutor
        console.log('Message from tutor:', newMessage);

        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setUnreadMessages({
          [newMessage.senderId]: true  // Only store the current senderId with true
        });
                fetchTutorList()

      }
    });
  
    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedTutorId]);  // Add selectedTutorId as a dependency
  

  // Detect scrolling to the top to load more messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !loading) {
      // If scrolled to the top, load more messages
      setSkip((prevSkip) => prevSkip + limit);  // Increase skip to load older messages
    }
  };

  const handlePass = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    setSkip(0);  // Reset skip when switching tutors
    setChatMessages([]);  // Clear previous chat history when switching tutors
    fetchOldChats(tutorId, 0);  // Use tutorId directly

    setUnreadMessages({tutorId:false})
  };
  

  return (
    <div className='bg-custom-gradient pt-[5%] flex w-full'>
      <StudentChatTutors
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTutors={filteredTutors}
        handlePass={handlePass}
        unreadMessages={unreadMessages}      />
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
