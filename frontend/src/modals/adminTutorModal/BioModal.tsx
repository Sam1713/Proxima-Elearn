import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


interface BioTypes{
    isOpen:boolean;
    onClose:()=>void
}
const BioModal:React.FC<BioTypes>=({isOpen,onClose})=> {
    const singleTutor=useSelector((state:RootState)=>state.admin.singleTutor)
    if (!isOpen) return null;  // If not open, don't render anything


  return (


    <div className='inset-0 fixed  flex justify-center items-center bg-white bg-opacity-30'>
        <div className='relative rounded-3xl bg-custom-gradient h-[90vh] overflow-auto scrollbar-hidden w-[70%]'>
        <button
          onClick={onClose}
          className='absolute top-0 right-2 text-white text-4xl rounded-full p-4'
        >
          &times;
        </button>
            <h1 className='mt-10 text-2xl font-bold text-white text-center'>Tutor Bio</h1>
        <p className='p-10 text-white leading-relaxed'>
            
        {singleTutor?.bio}
         </p>
        </div>
      
    </div>
  )
}

export default BioModal
