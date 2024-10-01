import React, { useEffect } from 'react';
import { Typography } from "@material-tailwind/react";
import VideoPlayer from './VideoPlayer';
import Options from './Options';
import Notification from './Notification';
import { ContextProvider } from '../context/RoomContext';
import { useParams } from 'react-router-dom';

function Room() {
  const { id } = useParams();
  console.log('c',id)

  return (
    <ContextProvider>
      <div className='pt-20'> 
        <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Video Chat</Typography>
        <VideoPlayer />
        <Options tutorId={id}>
          <Notification />
        </Options>
      </div>
    </ContextProvider>
  );
}

export default Room;
