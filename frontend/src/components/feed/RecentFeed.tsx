import React, {  useState } from 'react';
import { FaRegPlayCircle } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import {  useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface FileType {
  fileType: string;
}

const RecentFeed:React.FC=()=> {
 

  const { feeds } = useSelector((state:RootState) => state.feed);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [selectedMediaType, setSelectedMediaType] = useState('image'); // 'image' or 'video'
  const [selectedFeedIndex, setSelectedFeedIndex] = useState<number>(0);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const maxLength:number = 350; 

  const handleToggle = () => { 
    setIsExpanded(prev => !prev);
  };


  const handleMediaClick = (feedIndex:number, index:number) => {
    setSelectedFeedIndex(feedIndex);
    setSelectedMediaIndex(index);
    const file = feeds[feedIndex].files[index];
    const mediaType = determineMediaType(file);
    setSelectedMediaType(mediaType);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextMedia = () => {
    setSelectedMediaIndex((prevIndex) => (prevIndex + 1) % feeds[selectedFeedIndex].files.length);
    const mediaType = determineMediaType(feeds[selectedFeedIndex].files[(selectedMediaIndex + 1) % feeds[selectedFeedIndex].files.length]);
    setSelectedMediaType(mediaType);
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prevIndex) => (prevIndex - 1 + feeds[selectedFeedIndex].files.length) % feeds[selectedFeedIndex].files.length);
    const mediaType = determineMediaType(feeds[selectedFeedIndex].files[(selectedMediaIndex - 1 + feeds[selectedFeedIndex].files.length) % feeds[selectedFeedIndex].files.length]);
    setSelectedMediaType(mediaType);
  };

  const determineMediaType = (file:FileType)=> {
    console.log('did',file)
    return file.fileType === 'video' ? 'video' : 'image';
  };
console.log('fe',feeds)
  return (
    <div className='flex  flex-col border border-transparent   rounded-lg shadow-2xl  items-center justify-center my-10 w-full px-4'
    
    >
      {feeds.map((feed, feedIndex) => {
        const mediaCount = feed.files.length;
        const mediaClass = mediaCount === 1 
          ? 'w-full h-96 object-contain'
          : mediaCount === 2 
          ? 'w-1/3 h'
          : mediaCount === 3 
          ? 'md:w-1/4 w-1/3 h-48'
          :mediaCount===4
          ?'w-1/3 h-60  object-cover'
          : 'w-1/16 flex-wrap h-32';
        return (
          <div key={feedIndex} className='md:w-[100%] mt-5 max-w-4xl bg-black rounded-xl p-4 flex flex-col md:flex-row  items-start'>
            <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-4'>
              <div className='flex items-center justify-center w-16 h-16 rounded-full overflow-hidden'>
                <img className='w-full h-full object-cover rounded-full' src={feed?.userDetails?.profilePic}alt="Profile" />
              </div>
            </div>
            <div className='flex-grow  md:w-1/2'>
              <p className='text-white text-lg font-semibold font-protest '>
                {feed?.userDetails?.username}
              </p>
              <p className='font-mono text-white text-sm opacity-80 mb-2'>
  {(() => {
    const date = new Date(feed.createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  })()}
</p>
 
<p className='my-7 font-serif text-white md:w-auto'>
        {isExpanded || feed.content.length <= maxLength
          ? feed.content
          : `${feed.content.substring(0, maxLength)}...`}
      </p>
      {feed.content.length > maxLength && (
        <button onClick={handleToggle} className='text-blue-500'>
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
              <div  className='flex flex-wrap gap-4 max-w-prose md:max-w-screen-md'>
                {feed.files.map((item, index) => (
                  <div key={index} className={`flex-grow ${mediaClass} rounded-lg cursor-pointer`} onClick={() => handleMediaClick(feedIndex, index)}>
                    {item.fileType === 'image' ? (
                      <img className='w-full h-full object-cover rounded-lg' src={item.url} alt={`Media ${index + 1}`} />
                    ) : (
                      <div className='relative w-full h-full'>
  <FaRegPlayCircle className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-4xl text-white transition-transform' />
  <video className='w-full h-full  rounded-lg'>
                          <source src={item.url} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className='flex justify-between mt-3 w-full md:w-1/2'>
                <div className='flex items-center cursor-pointer text-white text-opacity-80'>
                  <AiFillLike className='mr-1' />
                </div>
                <div className='flex items-center cursor-pointer text-white text-opacity-80'>
                  <FaComments className='mr-1' />
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'>
          <div className='relative max-w-3xl p-4 bg-white rounded-lg'>
            <button className='absolute top-0 right-2 text-black' onClick={closeModal}>
              Close
            </button>
            <div className='flex justify-between items-center mb-4'>
              <button onClick={prevMedia} className='text-black'>
                Previous
              </button>
              <div className='text-black'>
                {selectedMediaIndex + 1}/{feeds[selectedFeedIndex].files.length}
              </div>
              <button onClick={nextMedia} className='text-black'>
                Next
              </button>
            </div>
            {selectedMediaType === 'image' ? (
              <img className='w-full h-96 object-cover rounded-lg' src={feeds[selectedFeedIndex].files[selectedMediaIndex].url} alt={`Media ${selectedMediaIndex + 1}`} />
            ) : (
              <video className='w-full h-96 object-cover rounded-lg' controls>
                <source src={feeds[selectedFeedIndex].files[selectedMediaIndex].url} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className='mt-4 text-black'>
              <h2>{feeds[selectedFeedIndex].username}</h2>
              <p className="h-[20vh] overflow-y-scroll">{feeds[selectedFeedIndex].content}</p>
            </div>
          </div>

        </div>
        
      )}

    </div>
  );
}

export default RecentFeed;
