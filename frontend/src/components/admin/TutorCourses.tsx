import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../API/Api';
import { setTutorCourses } from '../../redux/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AnimatedText from '../../animation/AnimatedText';
import notFound from '../../assets/images/49342678_9214777.jpg';

function TutorCourses() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const tutorCourses = useSelector((state: RootState) => state.admin.getTutorCourses);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTutorCourses();
  }, [dispatch]);

  const fetchTutorCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/backend/admin/getTutorCourses/${id}`, {
        headers: {
          'X-Token-Type': 'admin'
        }
      });
      dispatch(setTutorCourses(response.data));
    } catch (error) {
      console.error('Error fetching tutor courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/admin/tutorCourseDetail/${id}`);
  };

  return (
    <div className="bg-custom-gradient md:w-auto md:mx-10 mt-5 rounded-xl p-5 shadow-lg">
      {loading ? (
        <div className='flex justify-center items-center h-[60vh]'>
          <div className='w-16 h-16 border-4 border-t-4 border-white border-opacity-30 border-t-blue-500 rounded-full animate-spin'></div>
        </div>
      ) : tutorCourses && tutorCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-6">
          {tutorCourses.map((course, index) => (
            <div
              onClick={() => handleNavigate(course?._id)}
              key={index}
              className="bg-white bg-opacity-60 rounded-xl p-4 overflow-hidden shadow-md transform transition duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                className="w-full h-[20vh] object-cover"
                src={course?.coverImageUrl}
                alt={course.title}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{course.category}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className='font-thin'>Price:</span>
                    <span className="text-blue-700 font-bold mx-1">₹{course.price}</span>
                  </div>
                  <div>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center text-4xl w-full text-white min-h-[60vh]'>
          <AnimatedText text="No courses found" />
          <img className='w-[20%] h-22 rounded-xl animate-bounce mt-20' src={notFound} alt="No courses found" />
        </div>
      )}
    </div>
  );
}

export default TutorCourses;
