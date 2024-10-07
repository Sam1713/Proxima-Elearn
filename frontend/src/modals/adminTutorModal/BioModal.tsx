import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { updateBio } from '../../redux/tutor/tutorSlice';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BioTypes {
  isOpen: boolean;
  onClose: () => void;
  isEditable?: boolean;
  
}

const spinnerStyle: React.CSSProperties = {
  border: '4px solid rgba(0,0,0,0.1)',
  borderLeft: '4px solid #ffffff',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  animation: 'spin 1s linear infinite',
};

const BioModal: React.FC<BioTypes> = ({ isOpen, onClose, isEditable }) => {
  const singleTutor = useSelector((state: RootState) => state.admin.singleTutor);
  const myTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      bio: isEditable ? myTutor?.bio || '' : singleTutor?.bio || '',
    },
    validationSchema: Yup.object({
      bio: Yup.string().required('Bio is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const response = await axios.put('/backend/tutor/updateBio', 
          {
            bio: values.bio,
          }, 
          {
            headers: {
              'X-Token-Type': 'tutor', 
            },
          }
        );
        console.log('Bio updated successfully:', response.data);
        dispatch(updateBio(response.data));
        setIsEditing(false);
        toast.success('Updated Successfully')
      } catch (error) {
        console.error('Error updating bio:', error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null; 

  return (
    <div className='inset-0 fixed flex justify-center items-center  bg-white bg-opacity-30'>
      <ToastContainer/>
      {loading ? (
        <div style={spinnerStyle}></div>
      ) : (
        <div className='relative  rounded-3xl bg-custom-gradient h-[80vh] overflow-y-scroll  w-[50%]'>
          <button
            onClick={onClose}
            className='absolute top-0 right-2 text-white text-4xl rounded-full p-4'
          >
            &times;
          </button>
          <h1 className='mt-10 text-2xl font-bold text-white text-center'>Tutor Bio</h1>
          {isEditable && !isEditing && (
            <div className='flex justify-center gap-4 mt-4'>
              <button
                onClick={() => setIsEditing(true)}
                className='px-4 py-2 w-1/3 bg-blue-500 text-white rounded-lg'
              >
                Edit
              </button>
            </div>
          )}
          {isEditing ? (
            <form onSubmit={formik.handleSubmit}>
              <textarea
                className='p-4 mx-5 w-[95%] h-[70vh] bg-white text-black rounded-lg'
                id='bio'
                name='bio'
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.bio && formik.errors.bio ? (
                <div className='text-red-500'>{formik.errors.bio}</div>
              ) : null}

              <div className='flex justify-center gap-4 mt-4'>
                <button
                  type='submit'
                  className='px-4 py-2 bg-green-500 text-white rounded-lg'
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='px-4 py-2 bg-red-500 text-white rounded-lg'
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className='p-5 text-white leading-relaxed'>{formik.values.bio}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BioModal;
