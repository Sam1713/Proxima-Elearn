import React from 'react';
import { Input } from '@material-tailwind/react';
import '../../css/ChatComponent.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface Tutor {
  _id: string;
  tutorname: string;
  bio: string;
  latestMessage?: string; 
}

interface StudentChatTutorsProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredTutors: Tutor[];
  handlePass: (id: string) => void;
  selectedTutorId: string | null; 
  receiverId: string;
}

const StudentChatTutors: React.FC<StudentChatTutorsProps> = ({
  searchQuery,
  setSearchQuery,
  filteredTutors,
  handlePass,
  selectedTutorId,
}) => {
  const unreadMessagesRedux = useSelector((state: RootState) => state.student.unreadMessages || {});
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const receiverIds=useSelector((state:RootState)=>state.student.receiverId)
  const studentId = currentStudent?._id;
  console.log('unre',unreadMessagesRedux)
  return (
    <div className='w-[20%] mx-[1%] mt-2 rounded-xl bg-white bg-opacity-10 shadow-xl p-6'>
      <div className='mb-6'>
        <Input
          type='text'
          label='Search your tutor...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-sm' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}        />
      </div>
      <div className='tutor-list overflow-y-auto custom-scrollbar max-h-[calc(100vh-150px)]'>
        {filteredTutors.map((tutor) => {
          const isUnread = unreadMessagesRedux[tutor._id] === true;

          return (
            <div
              key={tutor._id}
              onClick={() => handlePass(tutor._id)}
              className={`px-2 py-1 mb-4 border border-gray-200 rounded-lg shadow-sm transition duration-300 cursor-pointer ${
                selectedTutorId === tutor._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-black hover:text-white'
              }`}
            > 
              <h2 className='text-md font-semibold text-blue-900'>{tutor.tutorname}</h2>
              <p className={`${isUnread && receiverIds === studentId ? 'text-red-900 font-bold' : 'text-sm text-gray-600'}`}>
                {tutor.latestMessage ? tutor.latestMessage : 'No messages...'}
              </p>
              {isUnread && receiverIds === studentId && (
                <span className="text-red-500 text-xs">Unread Message!</span> // Display indicator for unread messages
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentChatTutors;
