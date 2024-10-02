import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../../redux/store';
import { EditTutor } from '../../../types/modalTypes/EditModat';
import api from '../../../components/API/Api';
import { setUploadedCoursesDetails } from '../../../redux/tutor/tutorSlice';

interface EditSubVideosModalProps extends EditTutor {
    selectedVideo: { _id?: string; fileUrl: string; description: string } | null;
}

const EditSubVideosModal: React.FC<EditSubVideosModalProps> = ({ isOpen, onClose, selectedVideo }) => {
    const details = useSelector((state: RootState) => state.tutor.tutorUploadedCourseDetail);
    const [tempVideo, setTempVideo] = useState<string | File | null>(null);
    const dispatch = useDispatch();
    const id = selectedVideo?._id;
    const courseId = details?._id;

    // Initialize tempVideo with the existing fileUrl when selectedVideo changes
    useEffect(() => {
        if (selectedVideo?.fileUrl) {
            setTempVideo(selectedVideo.fileUrl);
        }
    }, [selectedVideo]);

    const formik = useFormik({
        initialValues: {
            subVideo: selectedVideo?.fileUrl || null, // Initialize with fileUrl or null
            description: selectedVideo?.description || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            subVideo: Yup.mixed().required('A video file is required'), // Change to mixed to allow for File or string
            description: Yup.string().required('Description is required'),
        }),
        onSubmit: async (values) => {
            console.log('va',values)
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to save the changes?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, save it!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const formData = new FormData();
                        formData.append('description', values.description);

                        if (values.subVideo) {
                            formData.append('subVideo', values.subVideo);
                        }

                        if (id) {
                            formData.append('videoId', id);
                        }

                        const response = await api.patch(`/backend/course/updateSubVideo/${courseId}`, formData, {
                            headers: { 
                                'X-Token-Type': 'tutor',
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        console.log('res', response);
                        dispatch(setUploadedCoursesDetails(response.data.course));
                        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
                        onClose(); // Close the modal after saving
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    }
                }
            });
        },
    });

    // If the modal is not open, return null
    if (!isOpen) return null;

    // Handle file change event
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            const file = event.currentTarget.files[0];
            formik.setFieldValue('subVideo', file); // Set file as the value for subVideo
            setTempVideo(file); // Update tempVideo to the new file
        }
    };
    
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-custom-gradient w-[70%] p-6 mt-20 rounded-lg shadow-lg text-white overflow-y-scroll h-[90vh]'>
                <h2 className='text-2xl font-bold mb-4'>Edit Sub-Video</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='description' className='block text-sm font-medium'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='mt-1 block w-full border p-4 text-black border-gray-300 rounded-md shadow-sm'
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className='text-red-600 text-sm'>{formik.errors.description}</div>
                        ) : null}
                    </div>

                    {tempVideo && (
                        <div className='mb-4'>
                            <label className='block text-sm font-medium'>
                                Existing Video:
                            </label>
                            <video 
                                src={tempVideo instanceof File ? URL.createObjectURL(tempVideo) : tempVideo} 
                                controls
                                className="w-full h-[40vh] mt-2"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    <div className='mb-4'>
                        <label htmlFor='subVideo' className='block text-sm font-medium'>
                            Upload New Video
                        </label>
                        <input 
                            id='subVideo'
                            name='subVideo'
                            type='file'
                            onChange={handleFileChange}
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm'
                        />
                        {formik.touched.subVideo && formik.errors.subVideo ? (
                            <div className='text-red-600 text-sm'>{formik.errors.subVideo}</div>
                        ) : null}
                    </div>

                    <div className='flex justify-end space-x-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubVideosModal;
