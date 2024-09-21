import React from 'react';
import { Input } from '@material-tailwind/react';
import '../../css/ChatComponent.css'
interface Tutor {
  _id: string;
  tutorname: string;
  bio: string;
}


interface StudentChatTutorsProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredTutors: Tutor[];
  handlePass: (id: string) => void;
  selectedTutorId: string | null; // Accept selected tutor ID as prop
  unreadMessages:any
}

const StudentChatTutors: React.FC<StudentChatTutorsProps> = ({
  searchQuery,
  setSearchQuery,
  filteredTutors,
  handlePass,
  selectedTutorId,
  unreadMessages
}) => {
  return (
    <div className='w-[20%] mx-[1%] mt-2 rounded-xl bg-white bg-opacity-10 shadow-xl p-6'>
      <div className='mb-6'>
        <Input
          type='text'
          label='Search your tutor...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-sm'
        />
      </div>
      <div className='tutor-list overflow-y-auto custom-scrollbar max-h-[calc(100vh-150px)]'>
        {filteredTutors.map((tutor) => (
          <div
            key={tutor._id}
            onClick={() => handlePass(tutor._id)}
            className={`px-2 py-1 mb-4 border border-gray-200 rounded-lg shadow-sm transition duration-300 cursor-pointer ${
              selectedTutorId === tutor._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-black hover:text-white'
            }`}
          >
            <h2 className='text-md font-semibold text-blue-900'>{tutor?.tutorname}</h2>
            <p className={`${unreadMessages[tutor._id] ? 'text-red-900' : 'text-sm text-gray-600'}`}>{tutor.latestMessage}...</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StudentChatTutors;
