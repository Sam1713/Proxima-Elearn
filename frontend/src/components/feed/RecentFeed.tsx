import React, { useEffect, useState } from 'react';
import { FaRegPlayCircle } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import axios from 'axios';
import { clearFeed, setFeeds } from '../../redux/feed/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../API/Api'
import { signout } from '../../redux/student/studentSlice';
import { useNavigate } from 'react-router-dom';


function RecentFeed({fetchFeeds}) {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  // useEffect(() => {
  //   const fetchFeeds = async () => {
      
    
  //     try {
  //       const response = await api.get('/backend/feed/getFeed',{
  //         headers: {
  //           'X-Token-Type': 'student',
  //         },
  //       });
  //       dispatch(setFeeds(response.data))
        
  //       console.log('Feeds response:', response.data);
  //       // Handle response
  //     } catch (error) {
  //         if (error.response) {
  //           const { status, data } = error.response;
     
  //           // Check if the error is due to the user being blocked
  //           if (status === 403 && data.error === 'UserBlocked') {
  //             dispatch(signout());
  //             dispatch(clearFeed());
  //             // Handle blocked user scenario
  //             alert(data.message); // Display message to user
  //             localStorage.removeItem('access_token'); // Clear access token from local storage
  //             navigate('/signin'); // Redirect to sign-in page
  //           } else {
  //             // Handle other errors
  //             console.error('An error occurred:', error);
  //           }
  //         } else {
  //           console.error('An error occurred:', error);
  //         }
        
  //     }
  //   }    
    
    
  //   fetchFeeds();
  // }, [dispatch]);
  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const { feeds } = useSelector((state:RootState) => state.feed);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedMediaType, setSelectedMediaType] = useState('image'); // 'image' or 'video'
  const [selectedFeedIndex, setSelectedFeedIndex] = useState(0);

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

  const determineMediaType = (file:unknown)=> {
    // Determine the media type based on the file object
    return file.fileType === 'video' ? 'video' : 'image';
  };

  return (
    <div className='flex  flex-col border border-transparent rounded-lg shadow-2xl  items-center justify-center my-10 w-full px-4'
    style={{
      background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333, #4d4d4d)', // Subtle black-to-gray gradient background
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
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
          : 'w-1/16 flex-wrap h-32'; // Adjust the default class for more than 3 items

        return (
          <div key={feedIndex} className='md:w-full mt-20 max-w-4xl bg-white bg-opacity-40 rounded-xl p-4 mb-8 flex flex-col md:flex-row  items-start'>
            <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-4'>
              <div className='flex items-center justify-center w-16 h-16 rounded-full overflow-hidden'>
                <img className='w-full h-full object-cover rounded-full' src='https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg'alt="Profile" />
              </div>
            </div>
            <div className='flex-grow  md:w-1/2'>
              <p className='text-white text-lg font-semibold '>
                {feed.title}
              </p>
              <p className='font-mono text-white text-sm opacity-80 mb-2 '>{feed.createdAt}</p>
              <p className='my-7 font-serif text-white md:w-auto'>
                {feed.content}
              </p>
              <div className='flex flex-wrap gap-4 max-w-prose md:max-w-screen-md'>
                {feed.files.map((item, index) => (
                  <div key={index} className={`flex-grow ${mediaClass} rounded-lg cursor-pointer`} onClick={() => handleMediaClick(feedIndex, index)}>
                    {item.fileType === 'image' ? (
                      <img className='w-full h-full object-cover rounded-lg' src={item.url} alt={`Media ${index + 1}`} />
                    ) : (
                      <div className='relative w-full h-full'>
                        <FaRegPlayCircle className='absolute inset-0 flex justify-center items-center text-4xl text-white transition-transform' />
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
                  {feed.likes}
                </div>
                <div className='flex items-center cursor-pointer text-white text-opacity-80'>
                  <FaComments className='mr-1' />
                  {feed.comments}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'>
          <div className='relative max-w-3xl p-4 bg-white rounded-lg'>
            <button className='absolute top-2 right-2 text-black' onClick={closeModal}>
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
              <p>{feeds[selectedFeedIndex].content}</p>
            </div>
          </div>
          <RecentFeed fetchFeeds={fetchFeeds}/>

        </div>
        
      )}

    </div>
  );
}

export default RecentFeed;
