import React, { useState } from 'react';
import SignupModal from '../../modals/adminauthModal/SignupModal';
import adminImgae from '../../assets/images/OIP (31).jpeg'
import { toast,ToastContainer } from 'react-toastify';
const AdminLogin: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [signupModalOpen, setSignupModalOpen] = useState<boolean>(false);
  const [signinModalOpen, setSigninModalOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const signupOpen = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);

  const openSigninModal = () => {
    
    setSigninModalOpen(true)
};
  const closeSigninModal = () => setSigninModalOpen(false);
  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message);
    }
    
};
const handleSwitchFormType = (formType: 'signup' | 'signin') => {
    if (formType === 'signup') {
      closeSigninModal();
      signupOpen();
    } else {
      closeSignupModal();
      openSigninModal();
    }
  };

  return (
    <>
     <ToastContainer />
      <div className="h-20">
      <img
  className={`${open &&!signupOpen ? 'md:pt-20 h-15  pt-52 w-[24%] rounded-xl' : 'md:pt-44  pt-52 w-[13%]  rounded-3xl'} mx-auto flex justify-center font-extrabold p-4 text-4xl animate-ping`}
  src={adminImgae} // Ensure 'adminImage' is correctly imported and used
  alt="Admin"
/>
      </div>
      <div className="flex justify-center items-center mt-[40%] md:mt-[15%]">
        {!open ? (
          <button onClick={handleOpen} className="bg-custom-gradient p-4 rounded-xl">
            <h1 className="font-serif text-white font-bold animate-fadeIn">Please Open it</h1>
          </button>
        ) : (
          <div className="md:mt-[-5%] w-[90%] md:w-1/3 p-8 bg-custom-gradient rounded-xl">
            <div className="mb-4">
              <button onClick={openSigninModal}className="w-full py-3 bg-white bg-opacity-25 rounded-lg hover:bg-opacity-50 transition duration-300">
                <h1 className="font-serif text-white font-bold animate-fadeIn">Signin</h1>
              </button>
            </div>
            <div>
              <button onClick={signupOpen} className="w-full py-3 bg-white bg-opacity-25 rounded-lg hover:bg-opacity-50 transition duration-300">
                <h1 className="font-serif text-white font-bold animate-fadeIn">Signup</h1>
              </button>
            </div>
          </div>
        )}
      </div>
      {signupModalOpen && (
        <SignupModal
          isOpen={signupModalOpen}
          onClose={closeSignupModal}
          formType="signup"
          showToast={showToast}
          onSwitchFormType={handleSwitchFormType}
        />
      )}
      {signinModalOpen && (
        <SignupModal
          isOpen={signinModalOpen}
          onClose={closeSigninModal}
          formType="signin"
          showToast={showToast}
          onSwitchFormType={handleSwitchFormType}
        />
      )}
    </>
  );
};

export default AdminLogin;
