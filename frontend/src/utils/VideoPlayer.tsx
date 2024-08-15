import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoUrl, description }) => {
  const playerRef = useRef(null);

  const handlePlay = () => {
    console.log('Video started playing');
  };

  const handlePause = () => {
    console.log('Video paused');
  };

  const handleEnded = () => {
    console.log('Video ended');
  };

  return (
    <div className='mb-5'>
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls={true}
        width='100%'
        height='auto'
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Disable download option
              onContextMenu: (e) => e.preventDefault(), // Disable right-click
              disablePictureInPicture: true, // Disable Picture-in-Picture
            }
          }
        }}
      />
      <h1 className='font-bold text-3xl undeline'>Description</h1>
      <p className='text-white mt-2 leading-6'>{description}</p>
    </div>
  );
};

export default VideoPlayer;
