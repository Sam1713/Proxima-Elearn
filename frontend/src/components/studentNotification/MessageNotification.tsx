import { FaEnvelope } from 'react-icons/fa'; // Import the envelope icon

interface MessageNotificationProps {
  unreadMessagesCount: number; 
}

const MessageNotification :React.FC<MessageNotificationProps> = ({ unreadMessagesCount }) => {
    console.log('coint',unreadMessagesCount)
  return (
    <div className="relative flex items-center">   
      {/* Envelope Icon */}
      <FaEnvelope className="text-white" size={20} />
      <div>
      {/* Display the unread messages count */}
      <span>{unreadMessagesCount}</span>
    </div>
    </div>
  );
};

export default MessageNotification;
