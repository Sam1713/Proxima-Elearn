import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryDetails, setUploadedCoursesDetails } from '../../redux/tutor/tutorSlice';
import { RootState } from '../../redux/store';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import EditCourseModal from '../../modals/tutorModal/editCourseModal/EditCourseModal';
import EditCoverImage from '../../modals/tutorModal/editCourseModal/EditCoverImage';
import EditSubVideosModal from '../../modals/tutorModal/editCourseModal/EditSubVideosModal';
import { Button } from '@material-tailwind/react';

function GetTutorCourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const details = useSelector((state: RootState) => state.tutor.tutorUploadedCourseDetail);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isLessonsExpanded, setIsLessonsExpanded] = useState(false);
  const [editCourse, setEditCourse] = useState<boolean>(false);
  const [editCoverImage, setEditCoverImage] = useState<boolean>(false);
  const [subVideos, setSubVideos] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null); // Added state for selected video
  const allCategories=useSelector((state:RootState)=>state.tutor.categoryDetails)
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await api.get(`/backend/course/getTutorCourseDetail/${id}`, {
          headers: {
            'X-Token-Type': 'tutor',
          },
        });
        console.log('res',response.data)
        dispatch(setUploadedCoursesDetails(response.data.course));
        dispatch(setCategoryDetails(response.data.category))
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };
    fetchCourseDetail();
  }, [id, dispatch]);
 console.log("cate",allCategories)
  const onEditCourse = () => {
    setEditCourse(true);
  };

  const handleCloseEdit = () => {
    setEditCourse(false);
  };

  const onEditCoverImage = () => {
    setEditCoverImage(true);
  };

  const onCloseCoverImage = () => {
    setEditCoverImage(false);
  };

  const onEditSubVideo = (video) => {
    setSelectedVideo(video); // Set the selected video for editing
    setSubVideos(true);
  };

  const onCloseEditSubVideo = () => {
    setSubVideos(false);
    setSelectedVideo(null); // Clear selected video on close
  };

  // const onDeleteCourse = async () => {
  //   try {
  //     await api.delete(`/backend/course/deleteCourse/${id}`, {
  //       headers: {
  //         'X-Token-Type': 'tutor',
  //       },
  //     });
  //     // Handle successful deletion (e.g., redirect or update UI)
  //   } catch (error) {
  //     console.error('Error deleting course:', error);
  //   }
  // };

  const onDeleteVideo = async (videoId) => {
    try {
      await api.delete(`/backend/course/deleteVideo/${videoId}`, {
        headers: {
          'X-Token-Type': 'tutor',
        },
      });
      // Handle successful deletion (e.g., update UI)
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);
  const toggleAbout = () => setIsAboutExpanded(!isAboutExpanded);
  const toggleLessons = () => setIsLessonsExpanded(!isLessonsExpanded);

  const coverImageUrl = details?.coverImageUrl ? `${details.coverImageUrl}?${new Date().getTime()}` : '';
  const videos = details?.videos?.map(video => ({
    ...video,
    fileUrl: `${video.fileUrl}?${new Date().getTime()}`
  }));

  const navigate=useNavigate()
  const handleGo=()=>{
   navigate('/getCallList')
  }
  const handleQuiz=(id:string)=>{
    console.log('quizid',id)
    navigate(`/addQuiz/${id}`)
  }
  return (
    <div className="bg-custom-gradient min-h-screen py-20 px-4 font-serif">
      <div className='mx-8 mb-4'>
        <Button onClick={handleGo} className='bg-red-500 p-4 rounded-xl'>Call Request</Button>
      </div>
      <div><Button onClick={()=>handleQuiz(details?._id)}></Button></div>
      {/* Cover Image */}
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-30 shadow-xl rounded-lg overflow-hidden mb-8 p-4">
        <div className="absolute top-0 right-8 mt-2 flex space-x-3">
          <Button
            onClick={onEditCoverImage}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <CiEdit className="text-xl" />
          </Button>
        </div>
        <div className="w-[98%] mx-auto">
          <h1 className="text-3xl font-extrabold text-white">Cover Image</h1>
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Course Cover"
              className="rounded-xl object-cover w-full h-96"
            />
          )}
        </div>
      </div>

      {/* Cover Video */}
      <div className="max-w-7xl relative mx-auto bg-white bg-opacity-30 rounded-lg shadow-lg p-8 mt-4 mb-4">
        <div className="absolute top-4 right-8 flex space-x-3">
          <button
            onClick={onEditCourse}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <CiEdit className="text-xl" />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Course Intro Video</h2>
        <div className="relative">
          <video
            src={details?.coverVideoUrl}
            controls
            className="w-full object-cover h-72 rounded-lg border border-gray-500"
          />
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-white relative bg-opacity-30 w-[95%] p-5 rounded-xl mx-auto">
        <div className="absolute top-3 right-8 flex space-x-3">
          <button
            onClick={onEditCourse}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <CiEdit className="text-xl" />
          </button>
        </div>
        <div className="w-[98%] mx-auto text-white mt-10 bg-gray-800 rounded-lg shadow-lg p-8 mb-4">
          <h1 className="text-4xl font-extrabold">{details?.title}</h1>
          <p className="text-xl mt-2">{details?.category}</p>
        </div>

        <div className="w-[98%] mx-auto bg-gray-800 rounded-lg shadow-lg p-8 mb-4">
          <h2 className="text-3xl font-bold text-white mb-4">Course Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {isDescriptionExpanded ? details?.description : `${details?.description.substring(0, 100)}...`}
          </p>
          <button onClick={toggleDescription} className="text-yellow-400 mt-2">
            {isDescriptionExpanded ? 'See Less' : 'See More'}
          </button>
          <div className="mt-6 text-2xl font-bold text-yellow-400">Price: ₹{details?.price}</div>
        </div>

        {/* About Course */}
        <div className="w-[98%] mx-auto bg-gray-700 rounded-lg shadow-lg p-8 mb-4">
          <h2 className="text-3xl font-bold text-white mb-4">About Course</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {isAboutExpanded ? details?.AboutCourse : `${details?.AboutCourse.substring(0, 100)}...`}
          </p>
          <button onClick={toggleAbout} className="text-yellow-400 mt-2">
            {isAboutExpanded ? 'See Less' : 'See More'}
          </button>
        </div>

        {/* Lessons */}
        <div className="w-[98%] mx-auto bg-gray-800 rounded-lg shadow-lg p-8 mb-4">
          <h2 className="text-3xl font-bold text-white mb-4">Lessons</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {isLessonsExpanded ? details?.lessons : `${details?.lessons.substring(0, 100)}...`}
          </p>
          <button onClick={toggleLessons} className="text-yellow-400 mt-2">
            {isLessonsExpanded ? 'See Less' : 'See More'}
          </button>
        </div>
      </div>

      {/* Video Lectures */}
      <div className="max-w-7xl mx-auto bg-custom-gradient to-white rounded-lg mt-5 shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Video Lectures</h2>
        <div className="grid lg:grid-cols-2 gap-6 overflow-y-scroll h-[50vh]">
          {videos?.map((video) => (
            <div key={video?.videoId} className="bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <video
                src={video?.fileUrl}
                controls
                className="w-full h-40 rounded-lg mb-4 border border-gray-500"
              />
              <p className="text-gray-300 leading-relaxed">{video?.description}</p>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => onEditSubVideo(video)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteVideo(video?.videoId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditCourseModal isOpen={editCourse} onClose={handleCloseEdit} />
      <EditCoverImage isOpen={editCoverImage} onClose={onCloseCoverImage} />
      <EditSubVideosModal isOpen={subVideos} onClose={onCloseEditSubVideo} selectedVideo={selectedVideo} />
    </div>
  );
}

export default GetTutorCourseDetail;
