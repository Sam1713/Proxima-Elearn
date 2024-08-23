import React from 'react';
import { EditTutor } from '../../../types/modalTypes/EditModat';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdOutlineSubtitles, MdCategory, MdOutlineDescription } from 'react-icons/md';
import { IoPricetags } from 'react-icons/io5';
import { FcAbout } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Swal from 'sweetalert2';
import api from '../../../components/API/Api';
import { setUploadedCoursesDetails } from '../../../redux/tutor/tutorSlice';

const EditCourseModal: React.FC<EditTutor> = ({ isOpen, onClose }) => {
  const detiledValue = useSelector((state: RootState) => state.tutor.tutorUploadedCourseDetail);
  const allCategories=useSelector((state:RootState)=>state.tutor.categoryDetails)
  const id = detiledValue?._id;
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      title: detiledValue?.title || '',
      category: detiledValue?.category || '',
      price: detiledValue?.price || '',
      description: detiledValue?.description || '',
      AboutCourse: detiledValue?.AboutCourse || '',
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      category: Yup.string().required('Category is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      description: Yup.string()
        .required('Description is required')
        .test('minWords', 'Description must contain at least 50 words', (value: string) => {
          return value && value.split(' ').filter(word => word.length > 0).length >= 50;
        }),
      AboutCourse: Yup.string()
        .required('About Course is required')
        .test('minWords', 'About Course must contain at least 50 words', (value: string) => {
          return value && value.split(' ').filter(word => word.length > 0).length >= 50;
        }),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save the changes?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formData = new FormData();
            for (const key in values) {
              formData.append(key, String(values[key as keyof typeof values]));
            }

            // Make the API request
            const response = await api.put(`/backend/course/updateCourseNonFileDetails/${id}`, formData, {
              headers: {
                'X-Token-Type': 'tutor',
              },
            });
console.log('res',response)
            dispatch(setUploadedCoursesDetails(response.data));

            Swal.fire(
              'Saved!',
              'Your changes have been saved.',
              'success'
            );
          } catch (error) {
            console.error('Error:', error);
            Swal.fire(
              'Error!',
              "Something went wrong.",
              'error'
            );
          }
        }
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-scroll">
      <div className="h-[85vh] top-10 bg-custom-gradient w-[70%] p-6 rounded-lg shadow-lg relative overflow-y-scroll">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition duration-200 ease-in-out"
        >
          &times;
        </button>
        <h1 className="text-2xl font-semibold text-white text-center mb-6">Edit Course Details</h1>
       
        <form onSubmit={formik.handleSubmit}>
          <div className="gap-4 flex justify-center items-center">
            <div className="w-full relative">
              <input 
                className={`relative pl-10 p-4 w-full rounded-xl mb-8 text-black ${formik.errors.title && formik.touched.title ? 'border-red-500' : ''}`}  
                type="text" 
                placeholder="Title" 
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-red-500 text-sm absolute bottom-3 left-0">{formik.errors.title}</div>
              ) : null}
              <div className="absolute top-1/3 left-3 transform -translate-y-1/3 text-2xl text-gray-400">
                <MdOutlineSubtitles />
              </div>
            </div>

            <div className="w-full relative">
            <select
        className={`relative pl-10 p-4 w-full rounded-xl mb-8 text-black ${formik.errors.category && formik.touched.category ? 'border-red-500' : ''}`}
        {...formik.getFieldProps('category')}
      >
        <option value="" label="Select category" />
        {allCategories.map((category) => (
          <option key={category.id} value={category?.categoryName}>
            {category?.categoryName}
          </option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category ? (
        <div className="text-red-500 text-sm absolute bottom-3 left-0">
          {formik.errors.category}
        </div>
      ) : null}
      <div className="absolute top-1/4 left-3 text-2xl text-gray-400">
        <MdCategory />
      </div>
            </div>
          </div>

          <div className="w-full relative">
            <input 
              className={`w-full pl-10 relative p-4 rounded-xl mb-8 text-black ${formik.errors.price && formik.touched.price ? 'border-red-500' : ''}`}  
              type="text" 
              placeholder="Price" 
              {...formik.getFieldProps('price')}
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="text-red-500 text-sm absolute bottom-3 left-0">{formik.errors.price}</div>
            ) : null}
            <div className="absolute top-1/4 left-3 text-2xl text-gray-400">
              <IoPricetags />
            </div>
          </div>

          <div className="w-full relative">
            <textarea 
              className={`pl-10 p-4 w-full rounded-xl mb-8 text-black resize-y ${formik.errors.description && formik.touched.description ? 'border-red-500' : ''}`}  
              name="description" 
              rows={8}
              placeholder="Description"
              {...formik.getFieldProps('description')}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm absolute bottom-3 left-0">{formik.errors.description}</div>
            ) : null}
            <div className="absolute top-4 left-3 text-2xl text-gray-400">
              <MdOutlineDescription />
            </div>
          </div>

          <div className="w-full relative">
            <textarea 
              className={`pl-10 p-4 w-full rounded-xl mb-8 text-black resize-y ${formik.errors.AboutCourse && formik.touched.AboutCourse ? 'border-red-500' : ''}`}  
              name="AboutCourse" 
              rows={8}
              placeholder="About Course"
              {...formik.getFieldProps('AboutCourse')}
            ></textarea>
            {formik.touched.AboutCourse && formik.errors.AboutCourse ? (
              <div className="text-red-500 text-sm absolute bottom-3 left-0">{formik.errors.AboutCourse}</div>
            ) : null}
            <div className="absolute top-4 left-3 text-2xl text-gray-400">
              <FcAbout className="text-black" />
            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
