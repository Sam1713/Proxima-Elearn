import React, { useState } from 'react'
import certificateImg from '../../assets/images/certificate-vector.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import editDetailModal from '../../modals/tutorModal/editDetailModal';
import EditDetailModal from '../../modals/tutorModal/editDetailModal';

const TutorProfile:React.FC=()=> {
    const currentTutor=useSelector((state:RootState)=>state.tutor.currentTutor)
    const [open,setOpen]=useState<boolean>(false)
    const handleEditTutorOpen=()=>{
          setOpen(true)
    }
    const handleEditTutorClose=()=>{
        setOpen(false)
    }
    console.log('bev',currentTutor)
    return (
        <>
        <div className='my-[5%] flex flex-col md:flex-row font-serif md:w-[100%] md:mt-5 rounded-3xl bg-custom-gradient p-5 gap-5'>
          <div className='md:w-[30%] shadow-2xl bg-gradient-to-r from-black via-gray-600 p-5 rounded-2xl'>
            <img className='border-slate-900 rounded-3xl shadow-2xl w-full h-[30vh]' src={certificateImg} alt="Tutor" />
            <div className='text-left flex mt-5 justify-between items-center mb-4'>
              <h1 className='font-bold text-white'>Tutorname:</h1>
              <span className='text-left text-white font-bold'>{currentTutor?.tutorname}</span>
            </div> 
            <hr />
    
            <div className='flex justify-between mt-4 items-center mb-4'>
              <h1 className='font-bold text-white'>Email:</h1>
              <span className='text-left text-sm text-white  md:mx-16'>{currentTutor?.email}</span>
            </div>
            <hr />
    
            <div className='flex justify-between mt-3 text-left items-center'>
              <h1 className='font-bold text-white'>Mobile:</h1>
              <span className='text-left text-white font-bold'>{currentTutor?.phonenumber}</span>
            </div>
            <div className='mt-20 text-center shadow-2xl '>
            <button onClick={handleEditTutorOpen} className='w-full bg-gradient-to-r from-black via-gray-900 to-white text-white py-2 px-4 rounded-lg'>
                Edit
</button>

           </div>
          </div>
          
          
    
          <div className='w-full flex flex-col gap-5'>
            <div className='relative w-full md:w-[90%] mx-auto mt-3 rounded-3xl h-[25vh] bg-white bg-opacity-40 overflow-hidden'>
              <p className='relative p-4 blur-sm bg-gradient-to-r from-black via-gray-400'>
                Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. Where can I get some? There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
              </p>
              <button className='rounded-xl p-4  bg-gradient-to-r from-black via-gray-900 to-white absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white'>Check Bio</button>
            </div>
    
            <div className='relative w-full md:w-[90%] mx-auto mt-3 rounded-3xl h-[25vh] bg-gradient-to-r from-black via-gray-300 overflow-hidden flex items-center justify-center'>
              <div className='flex blur-sm w-full h-full'>
                <img className="w-1/2 h-full object-cover" src={''} alt="Tutor" />
                <img className="w-1/2 h-full object-cover" src={''} alt="Certificate" />
                
              </div>
              
              <button  className='rounded-xl p-4 bg-gradient-to-r from-black via-gray-900 to-white absolute left-1/2 transform -translate-x-1/2 text-white'>Check Proofs</button>
              
              
            </div>
            <div className= ' gap-4 flex justify-end mt-16 mr-10'>
                <button  className='p-2 bg-green-500 text-white rounded-lg'>Approve</button>
                <button  className='p-2 bg-red-500 text-white rounded-lg'>Reject</button>
              </div>
          </div>

    
          {/* <BioModal isOpen={open} onClose={closeBio} />
          <FileModal isOpenFile={openfile} onCloseFile={closeFile}/> */}
          <EditDetailModal isOpen={open} onClose={handleEditTutorClose}/>

        </div>
        
        </>
      );
    }
    
    export default TutorProfile;
    