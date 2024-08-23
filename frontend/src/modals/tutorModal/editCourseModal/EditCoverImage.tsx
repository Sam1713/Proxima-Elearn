import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import api from "../../../components/API/Api";
import { setUploadedCourses, setUploadedCoursesDetails } from '../../../redux/tutor/tutorSlice';
import Swal from 'sweetalert2';

const EditCoverImage: React.FC<EditTutor> = ({ isOpen, onClose }) => {
    const detailedValue = useSelector((state: RootState) => state.tutor.tutorUploadedCourseDetail);
    const dispatch = useDispatch();
    const id = detailedValue?._id;

    const [previewImage, setPreviewImage] = useState<string | null>(detailedValue?.coverImageUrl || null);
    useEffect(() => {
        if (isOpen) {
            setPreviewImage(detailedValue?.coverImageUrl || null);
        } else {
            setPreviewImage(null); // Clear the preview when the modal is closed
        }
    }, [isOpen, detailedValue?.coverImageUrl]);
    const formik = useFormik({
        initialValues: {
            coverImage: null,
        },
        enableReinitialize: true,

        validationSchema: Yup.object({
            coverImage: Yup.mixed()
                .required('A cover image is required')
                .test('fileSize', 'File too large', value => !value || (value && value.size <= 3000000)) // 3MB limit
                .test('fileType', 'Unsupported file format', value => !value || (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))),
        }),
        onSubmit: async (values) => {
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
                    const formData = new FormData();
                    if (values.coverImage) {
                        formData.append('coverImage', values.coverImage);
                    }

                    try {
                        const response = await api.patch(`/backend/course/updateCoverImage/${id}`, formData, {
                            headers: {
                                'X-Token-Type': 'tutor',
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        console.log('RESPONSE', response);
                        dispatch(setUploadedCoursesDetails(response.data.updatedCourse));
                        Swal.fire(
                            'Saved!',
                            'Your changes have been saved.',
                            'success'
                        );
                        onClose(); // Close the modal after saving
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire(
                            'Error!',
                            'Something went wrong.',
                            'error'
                        );
                    }
                }
            });
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        if (file) {
            formik.setFieldValue('coverImage', file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);

            // Revoke the object URL to free up memory when the component unmounts or a new file is selected
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
            setPreviewImage(detailedValue?.coverImageUrl || null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-20 flex justify-center items-center overflow-y-scroll">
            <div className="h-auto bg-custom-gradient w-[50%] p-6 rounded-lg shadow-lg relative text-white">
                <button
                    onClick={() => {
                        
                        onClose();
                    }}
                    className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-600 transition duration-200 ease-in-out"
                >
                    &times;
                </button>
                <h1 className="text-2xl font-semibold text-center mb-6">Edit Cover Image</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col items-center">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Current Cover"
                                className="mb-4 w-[100%] h-[50vh] object-contain rounded-lg"
                            />
                        )}
                        <div className="relative mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                                onClick={() => document.querySelector('input[type="file"]')?.click()}
                            >
                                Choose File
                            </button>
                        </div>
                        {formik.errors.coverImage && formik.touched.coverImage ? (
                            <div className="text-red-500 text-sm">{formik.errors.coverImage}</div>
                        ) : null}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCoverImage;
