import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API/Api';
import { setCourseDetails } from '../../redux/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AnimatedText from '../../animation/AnimatedText';
import notFound from '../../assets/images/49342678_9214777.jpg'

const TutorCourseDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const courseDetail = useSelector((state: RootState) => state.admin.singleCourseDetail);

  useEffect(() => {
    fetchTutorCourseDetails();
  }, []);

  const fetchTutorCourseDetails = async () => {
    const response = await api.get(`/backend/admin/tutorCourseDetail/${id}`, {
      headers: {
        'X-Token-Type': 'admin'
      }
    });
    console.log('res', response);
    dispatch(setCourseDetails(response.data));
  };

  return (
    <div className="bg-custom-gradient bg-opacity-70 md:w-[95%] md:mx-auto h-full p-8 rounded-xl shadow-xl">
      <div className="mb-8">
        <img
          className="w-full h-[300px] object-cover rounded-lg shadow-lg"
          src={courseDetail?.coverImageUrl} 
          alt="Course Cover"
        />
      </div>

      <div className="mb-6">
        <h1 className="text-white text-4xl font-serif font-bold mb-2">{courseDetail?.title}</h1>
        <span className="text-gray-400 text-lg font-medium font-poppins">Category: {courseDetail?.category}</span>
      </div>

      {/* About Course Description */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-serif font-bold mb-4">About this Course</h2>
        <p className="text-gray-300 text-lg leading-relaxed font-poppins">
          {courseDetail?.AboutCourse}
        </p>
      </div>

      {/* Cover Video */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-serif font-bold mb-4">Cover Video</h2>
        <div className="relative pb-56.25">
          <video
            className="h-[40vh] top-0 object-cover left-0 w-full  rounded-lg shadow-lg"
            controls
          >
            <source src={courseDetail?.coverVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Course Contents */}
      {/* <div className="mb-8">
        <h2 className="text-white text-3xl font-serif font-bold mb-4">Course Contents</h2>
        <ul className="list-disc pl-5 text-gray-300 text-lg space-y-2">
          {courseDetail?.contents.map((content, index) => (
            <li key={index} className="transition-colors duration-200 hover:text-white">
              {content}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Sub Videos */}
      <div className="mb-12">
  <h2 className="text-white text-3xl font-serif font-bold mb-6">Sub Videos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {courseDetail?.videos.map((video, index) => (
      <div
        key={index}
        className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
      >
        <video
          className="w-full h-[200px] object-cover"
          controls
          poster={video.thumbnailUrl} // Optional: Add a thumbnail preview for the video
        >
          <source src={video.fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-6">
          <h3 className="text-white text-lg h-[10vh] overflow-y-scroll font-semibold mb-2">
            {video.description}
          </h3>
          <p className="text-gray-400 text-sm">
            Duration: {video.duration} mins
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default TutorCourseDetails;
