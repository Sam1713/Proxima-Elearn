import React, { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { EditTutor } from '../../types/modalTypes/EditModat'; // Adjust the path as needed
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { response } from 'express';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Define the type for SubVideo
interface SubVideo {
  file: File | null;
  description: string;
}

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  AboutCourse: Yup.string().required('About Course is required'),
  lessons: Yup.string().required('Lessons are required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  coverImage: Yup.mixed().required('Cover Image is required'),
  coverVideo: Yup.mixed().required('Cover Video is required'),
  videos: Yup.array().of(
    Yup.object().shape({
      file: Yup.mixed().required('File is required'),
      description: Yup.string().required('Description is required'),
    })
  )
});


const AddCourseModal: React.FC<EditTutor> = ({ isOpen, onClose }) => {
  const [subVideos, setSubVideos] = useState<SubVideo[]>([{ file: null, description: '' }]);
  const [loading,setLoading]=useState<boolean>(false)
  const styles = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(0px)',
    config: { duration: 300 },
  });
  const category=useSelector((state:RootState)=>state.admin.viewAllCategory)
  console.log('cat',category)

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      description: '',
      AboutCourse: '',
      lessons: '',
      price: 0,
      coverImage: null,
      coverVideo: null,
      videos: [{ file: null, description: '' }],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Show a confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit the course?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
      });

      // If the user cancels, exit the function
      if (result.isDismissed) {
        return;
      }
      setLoading(true)
      // Proceed with form submission if confirmed
      const tutor_access_token = localStorage.getItem('tutor_access_token');

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('AboutCourse', values.AboutCourse);
      formData.append('lessons', values.lessons);
      formData.append('price', values.price.toString());

      if (values.coverImage) {
        formData.append('coverImage', values.coverImage);
      }

      if (values.coverVideo) {
        formData.append('coverVideo', values.coverVideo);
      }

      values.videos.forEach((video, index) => {
        if (video.file) {
          formData.append('videos', video.file);
          formData.append('videoDescriptions[]', video.description);

        }
      });

      try {
        const response = await axios.post('/backend/course/uploadCourse', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${tutor_access_token}`,
          },
        });
        console.log('Response:', response);
       setLoading(false)
        Swal.fire({
          title: 'Success!',
          text: 'Course uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
   
        resetForm();
        onClose(); 
      } catch (error) {
        setLoading(false)
        console.error('Error uploading course:', error);

        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload course. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },
  });
  
  const [imageUrl, setImageUrl] = useState('');

  const handleFileImage = (event:React.ChangeEvent<HTMLInputElement> ) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    formik.setFieldValue('coverImage', file); 
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl('');
    }
  };

  console.log('Formik errors:', formik.errors);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileVideo = (event:React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    formik.setFieldValue('coverVideo', file);

    if (file) {
      // Create a temporary URL for the selected video
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      // Optional: Revoke the URL after the component is unmounted
      return () => URL.revokeObjectURL(url);
    } else {
      // Clear the video URL if no file is selected
      setVideoUrl('');
    }
  };



  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    console.log('sdf',files)
    if (files) {
      setSubVideos(prevVideos => {
        const updatedVideos = [...prevVideos];
        updatedVideos[index].file = files[0];
        formik.setFieldValue('videos', updatedVideos);
        return updatedVideos;
      });
    }
  };

  const handleDescriptionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setSubVideos(prevVideos => {
      const updatedVideos = [...prevVideos];
      updatedVideos[index].description = value;
      formik.setFieldValue('videos', updatedVideos);
      return updatedVideos;
    });
  };

  const addSubVideo = () => {
    const newVideos = [...subVideos, { file: null, description: '' }];
    setSubVideos(newVideos);
    formik.setFieldValue('videos', newVideos);
  };

  const removeVideoField = (index: number) => {
    const newVideos = subVideos.filter((_, i) => i !== index);
    setSubVideos(newVideos);
    formik.setFieldValue('videos', newVideos);
  };
console.log({...subVideos})
  return (
    isOpen ? (
      <animated.div
        style={{
          ...styles,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="bg-custom-gradient p-6 rounded-lg shadow-lg h-[80vh] w-[80%] overflow-scroll"
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            fontSize: '24px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <h2 className='text-lg font-bold mb-4 white'>Add a New Course</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className='flex md:flex-row flex-col text-black w-full md:w-[90%] mx-auto gap-5'>
            <div className='flex justify-between items-center md:w-1/2'>
              <input 
                type="text" 
                placeholder='Title' 
                className='w-full md:p-3 p-2 border text-black border-gray-300 rounded-md'
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className='text-red-500'>{formik.errors.title}</div>
              ) : null}
            </div>
            <div className='flex justify-between items-center md:w-1/2'>
  <select
    name="category"
    className='w-full md:p-3 p-2 border text-black border-gray-300 rounded-md'
    value={formik.values.category}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
    <option value="">Select Category</option>
    {category.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.categoryName}
      </option>
    ))}
  </select>
  {formik.touched.category && formik.errors.category ? (
    <div className='text-red-500'>{formik.errors.category}</div>
  ) : null}
</div>

          </div>
          <input
  type="number" // Ensure the input type is number
  placeholder='Price'
  className='w-[90%] mx-14 mt-3  md:p-3 p-2 border text-black border-gray-300 rounded-md'
  name="price"
  value={formik.values.price}
  onChange={(event) => {
    formik.setFieldValue('price', parseFloat(event.target.value)); // Parse as float
  }}
  onBlur={formik.handleBlur}
/>
{formik.touched.price && formik.errors.price ? (
  <div className='text-red-500'>{formik.errors.price}</div>
) : null}

          <div className='mx-14 mt-3'>
            <textarea 
              placeholder='Description' 
              className='w-full text-black p-4 border border-gray-300 rounded-md'
              rows={8}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className='text-red-500'>{formik.errors.description}</div>
            ) : null}
          </div>
          <div className='mx-14 mt-3'>
            <textarea 
              placeholder="What will you learn"
              className='w-full text-black p-4 border border-gray-300 rounded-md'
              rows={6}
              name="AboutCourse"
              value={formik.values.AboutCourse}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className='text-red-500'>{formik.errors.description}</div>
            ) : null}
          </div>
          <div className='mx-14 mt-3'>
            <textarea 
              placeholder="Lessons"
              className='w-full text-black p-4 border border-gray-300 rounded-md'
              rows={6}
              name="lessons"
              value={formik.values.lessons}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className='text-red-500'>{formik.errors.description}</div>
            ) : null}
          </div>
          <div className='mx-14 mt-3'>
            <label className='block text-sm font-medium text-gray-100 mb-2'>
              Cover Image
            </label>
            <input 
              type="file" 
              className='bg-red-400 w-full p-3 border border-gray-300 rounded-md cursor-pointer'
              accept="image/*"
              name="coverImage"
              onChange={handleFileImage}
            />
            {imageUrl && (
        <div className='mt-2'>
          <img src={imageUrl} alt="Preview" className='w-full h-auto rounded-md' />
        </div>
      )}
            {formik.touched.coverImage && formik.errors.coverImage ? (
              <div className='text-red-500'>{formik.errors.coverImage}</div>
            ) : null}
          </div>
          <div className='mx-14 mt-3'>
            <label className='block text-sm font-medium text-gray-100 mb-2'>
              Cover Video
            </label>
            <input 
              type="file" 
              className='bg-red-400 w-full p-3 border border-gray-300 rounded-md cursor-pointer'
              accept="video/*"
              name="coverVideo"
               onChange={handleFileVideo}

            />
            {videoUrl && (
        <div className='mt-2'>
          <video src={videoUrl} controls className='w-full h-auto rounded-md' />
        </div>
      )}
            {formik.touched.coverVideo && formik.errors.coverVideo ? (
              <div className='text-red-500'>{formik.errors.coverVideo}</div>
            ) : null}
          </div>
          {subVideos.map((sub, index) => (
            <div key={index} className='mx-14 mt-3'>
              <label className='block text-sm font-medium text-gray-100 mb-2'>
                Sub Videos
              </label>
              <input 
                type="file" 
                className='bg-red-400 w-full p-3 border border-gray-300 rounded-md cursor-pointer'
                accept="video/*"
                name={`videos[${index}].file`}
                onChange={(event) => handleFileChange(index, event)}
              />
              <textarea 
                placeholder='Sub Video Description' 
                className='w-full text-black p-4 border border-gray-300 rounded-md mt-2'
                rows={4}
                name={`videos[${index}].description`}
                value={sub.description}
                onChange={(event) => handleDescriptionChange(index, event)}
              />
              {index > 0 && (
                <button 
                  type='button' 
                  className='text-red-500 mt-2'
                  onClick={() => removeVideoField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className='flex justify-between items-center mx-14 mt-5'>
            <button
              type='button'
              className='bg-blue-500 text-white px-4 py-2 rounded-md'
              onClick={addSubVideo}
            >
              Add Sub Video
            </button>
            <button
              type='submit'
              className='bg-green-500 text-white px-4 py-2 rounded-md'
            >
             {loading?'Loading...':'Submit'}
            </button>
          </div>
        </form>
      </animated.div>
    ) : null
  );
};
export default AddCourseModal