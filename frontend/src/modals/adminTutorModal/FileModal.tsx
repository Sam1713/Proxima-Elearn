import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddFileModal from '../tutorModal/AddFileModal';
import Swal from 'sweetalert2';
import axios from 'axios';

interface FileModalTypes {
  isOpen: boolean;
  onCloseFile: () => void;
  isEditable?: boolean;
}

const FileModal: React.FC<FileModalTypes> = ({ isOpen, onCloseFile, isEditable }) => {
  const singleTutor = useSelector((state: RootState) => state.admin.singleTutor);
  const myTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const [addFile, setAddFile] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      files: isEditable ? myTutor?.files || [] : singleTutor?.files || [],
    },
    validationSchema: Yup.object({
      files: Yup.array()
        .of(Yup.mixed().required('File is required'))
        .test('fileType', 'Unsupported file format', (files) => {
          if (!files) return false;
          return files.every((file: any) => {
            const isImage = /\.(jpeg|jpg|gif|png)$/i.test(file.name);
            const isPDF = /\.pdf$/i.test(file.name);
            return isImage || isPDF;
          });
        })
        .required('Please upload at least one file'),
    }),
    
    onSubmit: async (values) => {
      try {
        console.log('Files updated successfully:', values.files);
        onCloseFile(); // Close the modal after saving
      } catch (error) {
        console.error('Error updating files:', error);
      }
    },
  });

  const handleRemoveFile = async (index: number) => {
    
    // Display confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    });
  
    if (result.isConfirmed) {
      try {
        const fileToRemove = formik.values.files[index];

        // Send request to backend to delete the file
        const token = localStorage.getItem('tutor_access_token');
        const response=await axios.delete('/backend/tutor/deleteFile',{
          headers: { Authorization: `Bearer ${token}` },
          data: { file: fileToRemove }
        });
       console.log('res',response)
        // Remove the file from the local state
        const updatedFiles = [...formik.values.files];
        updatedFiles.splice(index, 1);
        formik.setFieldValue('files', updatedFiles);
  
        Swal.fire('Deleted!', 'The file has been removed.', 'success');
      } catch (error) {
        console.error('Error removing file:', error);
        Swal.fire('Error!', 'There was an issue removing the file.', 'error');
      }
    }
  };
  
  if (!isOpen) return null;

  const handleAddFile = () => {
    setAddFile(true);
  };

  const handleCloseFile = () => {
    setAddFile(false);
  };

  return (
    <>
      <div className='inset-0 fixed bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white w-[70%] h-[90vh] rounded-xl shadow-lg overflow-y-auto relative'>
          <button
            onClick={onCloseFile}
            className='md:mr-56 md:top-2 md:right-0 fixed text-black text-4xl rounded-full p-4'
          >
            &times;
          </button>
          {isEditable && (
            <button
              onClick={handleAddFile}
              className='bg-green-500 rounded-xl mx-[25%] w-[50%] mt-10 p-3'
            >
              Add file
            </button>
          )}
          <div className='p-6'>
            {formik.errors.files && formik.touched.files ? (
              <div className='text-red-500'>{formik.errors.files}</div>
            ) : null}

            {formik.values.files && formik.values.files.length > 0 ? (
              formik.values.files.map((file: string, index: number) => {
                const isImage = /\.(jpeg|jpg|gif|png)$/i.test(file);
                const isPDF = /\.pdf$/i.test(file);

                return (
                  <div key={index} className='p-4 object-contain bg-custom-gradient rounded-xl mb-4 shadow-md'>
                    {isEditable && (
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className='bg-red-500 float-right'
                      >
                        Remove
                      </button>
                    )}
                    {isImage && (
                      <img
                        src={file}
                        alt={file}
                        className='w-[50%] mx-[25%] object-contain h-auto rounded-lg'
                      />
                    )}
                    {isPDF && (
                      <iframe
                        src={file}
                        className='w-full h-[500px] rounded-lg'
                        title={`PDF-${index}`}
                      ></iframe>
                    )}
                    {!isImage && !isPDF && (
                      <p className='text-red-500'>Unsupported file format</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className='text-gray-700'>No files available.</p>
            )}
            {isEditable && (
              <button
                type='button'
                onClick={() => formik.handleSubmit()}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg mt-4'
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
        <AddFileModal isOpen={addFile} onClose={handleCloseFile} />
      </div>
    </>
  );
};

export default FileModal;