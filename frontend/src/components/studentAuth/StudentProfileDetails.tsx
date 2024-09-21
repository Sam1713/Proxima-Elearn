import React, { useState } from 'react';
import PostEdit from '../../modals/PostEdit';  // Ensure the correct path to PostEdit
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostPassword from '../../modals/PostPassword';

const StudentProfileDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);  // State for full-screen image
  const [modal,setModal]=useState<boolean>(false)
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);

   const passwordOpenModel=()=>setModal(true)
   const passwordCloseModel=()=>setModal(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);  // Toggle full-screen state
  const id = currentStudent?._id || ''; // Ensure id is properly set

  const handleToast = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <>
    <div className='md:w-[30%] w-full md:mt-5 md:mx-20 py-[40%] md:py-0  mt-5 md:flex-col rounded-lg shadow-lg'>
      <ToastContainer />
      <div className='md:w-full w-full bg-custom-gradient  bg-opacity-10 p-4 rounded-lg shadow-lg flex flex-col items-start'>
        <div className='mx-auto'>
          <img
            className={`w-40 h-40 rounded-full object-cover cursor-pointer ${isFullScreen ? 'fixed inset-0 md:w-[50%] w-[90%] h-[41%] mt-[70%] md:mt-0 rounded-full md:h-full mx-auto object-cover z-50' : ''}`}  // Apply styles conditionally
            src={currentStudent?.profilePic || "https://static.vecteezy.com/system/resources/previews/000/574/512/large_2x/vector-sign-of-user-icon.jpg"}
            alt="User"
            onClick={toggleFullScreen}  // Toggle full-screen state on click
          />
        </div>
        {!isFullScreen &&
          <>
            <div className='mt-10 w-full text-start   bg-custom-gradient rounded-xl p-4'>
              <div className='flex text-white items-center mb-5'>
                <h2 className='text-xl text-white  font-semibold mr-2'>Name:</h2>
                <p className=''>{currentStudent?.username}</p>
              </div>
              <div className='flex items-center mb-2'>
                <h2 className='text-xl text-white font-semibold mr-2'>Email:</h2>
                <p className='text-white'>{currentStudent?.email}</p>
              </div>
              <div className='mb-2 mt-4 flex items-center'>
                <h2 className='text-md text-white font-semibold mr-2'>Password:</h2>
                <p className='text-white'>*******</p>
              </div>
            </div>
                 <div className='md:mt-5 text-white font-medium md:mx-5 underline hover:text-black cursor-pointer'>
                  <h1 onClick={passwordOpenModel}>Need to change password?</h1>
                 </div>
            <div className='mx-auto mt-20 w-full text-center rounded-lg bg-red-400'>
              <button onClick={openModal} className='text-center text-white p-2'>Edit</button>
            </div>
          </>
        }
      </div>
      
    </div>
    {isModalOpen && currentStudent && (
      <PostEdit
        isOpen={isModalOpen}
        onClose={closeModal}
        id={id}
        showToast={handleToast}
      />
      
    )}
    {modal &&(
      <PostPassword onClose={passwordCloseModel}/>
    )}
    </>
  );
};

export default StudentProfileDetails;
