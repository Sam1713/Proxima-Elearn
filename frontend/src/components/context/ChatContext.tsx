// ChatContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../API/Api'; // Adjust the path according to your structure
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
      const studentId = currentStudent?._id;
  const [tutorList, setTutorList] = useState<[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<[]>([]);
  const [skip, setSkip] = useState<number>(0);  // Pagination tracking
  const limit = 12;  // Messages per fetch
  const [loading, setLoading] = useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = useState<{ [tutorId: string]: boolean }>({});
  const [receiverId, setReceiverId] = useState<string>('');
  const [instantMessage, setInstantMessage] = useState<string>('');
  const unreadMessagesCountRef = useRef<number>(0);
  const socket = io('http://localhost:3000');  // Replace with your server URL

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
      setChatMessages((prevMessages) => [...response.data.chats.reverse(), ...prevMessages]);
    } catch (error) {
      console.error('Error fetching old chats', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        senderId: studentId,  // Ensure you have access to studentId here
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
        params: { tutorId: selectedTutorId },
      })
        .then(() => {
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage('');
          setUnreadMessages({
            [newMessage.receiverId]: false
          });
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
        console.log('recieverd')
      if (newMessage.receiverId === studentId) {
        if (newMessage.senderId === selectedTutorId) {
          unreadMessagesCountRef.current = 0;
          console.log('rec',newMessage)
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          setUnreadMessages((prev) => ({
            ...prev,
            [newMessage.senderId]: false,
          }));
        } else {
          unreadMessagesCountRef.current += 1;
          setInstantMessage(newMessage.message);
          setReceiverId(newMessage.receiverId);
          setUnreadMessages((prev) => ({
            ...prev,
            [newMessage.senderId]: true,
          }));
        }
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

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !loading) {
      setSkip((prevSkip) => prevSkip + limit);
    }
  };

  return (
    <ChatContext.Provider value={{
      tutorList,
      filteredTutors,
      searchQuery,
      setSearchQuery,
      selectedTutorId,
      setSelectedTutorId,
      message,
      setMessage,
      chatMessages,
      loading,
      sendMessage,
      handleTutorSelection,
      handleScroll,
      unreadMessages,
      receiverId,
      instantMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
