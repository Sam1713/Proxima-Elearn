import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
interface VideoPlayerProps {
  videoUrl: string; 
  description: string; 
}

const VideoPlayer:React.FC<VideoPlayerProps> = ({ videoUrl, description }) => {
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
              controlsList: 'nodownload', 
              onContextMenu: (e: React.MouseEvent<HTMLVideoElement>) => e.preventDefault(),
              disablePictureInPicture: true,
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
