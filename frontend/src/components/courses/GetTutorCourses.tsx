import React, { useEffect, useState } from 'react';
import api from '../API/Api';
import { setUploadedCourses } from '../../redux/tutor/tutorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
  
const GetTutorCourses:React.FC=()=> {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploadedCourses = useSelector((state: RootState) => state.tutor.tutorUploadedCourses);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3; 

  const fetchTutorCourses = async () => {
    try {
      console.log('sdfsf')
      const response = await api.get(`/backend/course/getTutorCourses?page=${page}&limit=${limit}`, {
        headers: {
          'X-Token-Type': 'tutor',
        },
      });
      dispatch(setUploadedCourses(response.data.courses));
      console.log('sfds',response)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchTutorCourses();
  }, [dispatch, page]);

  const handleNavigate = async (id:string) => {
    console.log('iif',id);
    
    navigate(`/getTutorCourseDetail/${id}`);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to approve this tutor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
      });
    
      if (result.isConfirmed) {
      await api.delete(`/backend/course/deleteCourse/${id}`, {
        headers: {
          'X-Token-Type': 'tutor',
        },
      });
      fetchTutorCourses();
      Swal.fire({
        title: 'Approved!',
        text: 'The tutor has been approved.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } 
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleNextPage = () => {
    console.log('next page')
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="bg-custom-gradient min-h-screen w-full px-8">
  <h1 className="text-3xl text-white underline font-thin text-center mb-8">
    Your Courses
  </h1>

  <div className="relative grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
    {uploadedCourses?.length > 0 ? (
      uploadedCourses.map((course) => (
        <div
          key={course?._id}
          onClick={() => handleNavigate(course?._id)}
          className="bg-gradient-to-r from-black via-gray-1000 to-white p-5 rounded-lg shadow-lg cursor-pointer transform transition-shadow duration-300 ease-in-out hover:shadow-2xl"
        >
          <img
            src={course?.coverImageUrl}
            alt="Tutor Course"
            className="relative w-full rounded-xl h-48 object-cover transform transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the button click from triggering the parent div's onClick
              handleDeleteCourse(course?._id);
            }}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <MdDelete className="text-2xl" />
          </button>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-100 h-[5vh] overflow-hidden">
              {course?.title}
            </h2>
            <p className="text-sm text-gray-200 mt-2 h-[5vh] overflow-y-scroll">
              {course?.description}
            </p>
          </div>
          <hr className="my-4" />
          <div className="text-gray-100 text-lg font-serif">
            Category: <span className="font-semibold">{course?.category}</span>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center text-white text-lg mt-8">
        <p>No courses added yet.</p>
      </div>
    )}
  </div>

  {uploadedCourses?.length > 0 && (
    <div className="flex justify-center mt-8">
      <button
        onClick={handlePreviousPage}
        disabled={page === 1}
        className={`px-4 py-2 rounded-md mr-2 ${
          page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        Previous
      </button>
      <p className="text-white mt-2">Page {page} of {totalPages}</p>
      <button
        onClick={handleNextPage}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-md ${
          page === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        Next
      </button>
    </div>
  )}
</div>

  );
}

export default GetTutorCourses;
