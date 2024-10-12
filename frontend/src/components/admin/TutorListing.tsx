import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminStoreEachTutorDetail, adminStoreTutorDetails } from '../../redux/admin/adminSlice';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../API/Api'
// Tutor Detail Interface
// interface TutorDetail {
//   _id: string;
//   tutorname: string;
//   email: string;
//   phonenumber: string;
// }

const TutorListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tutorDetails = useSelector((state: RootState) => state.admin.tutorDetails||[]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages,setTotalPages]=useState<number>(1)
  const limit=4

  useEffect(() => {
    const fetchTutors = async (currentPage:number,limit:number) => {
      try {
        // const token = localStorage.getItem('admin_access_token');
        const response = await api.get('/backend/admin/tutorlist', {
          headers: {
          "X-Token-Type":'admin'
          },
          params:{
            page:currentPage,
            limit:limit
          }

        });
        console.log('API response data:', response.data);
        dispatch(adminStoreTutorDetails(response.data.sanitizedTutors));
        setTotalPages(response.data.totalTutors)
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors(currentPage,limit);
  }, [dispatch,currentPage,limit]);

  const handleValidateClick = async (id: string) => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get(`/backend/admin/tutorDetails/${id}`, {
        headers: {
          'X-Token-Type':'admin',
        },
        
      });
      dispatch(adminStoreEachTutorDetail(response.data));
      navigate(`/admin/tutorDetails/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCoursesClick = (id: string) => {
    navigate(`/admin/tutorCourses/${id}`);
  };
  const indexOfLastUser = currentPage * limit;

  const indexOfFirstUser = indexOfLastUser - limit;

  const filteredTutors = Array.isArray(tutorDetails) ? tutorDetails.filter(tutor => 
    tutor.tutorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.phonenumber.includes(searchTerm)
  ):[];

  
  const handleNext=()=>{
    setCurrentPage(currentPage+1)
  }
  const handlePrev=()=>{
    setCurrentPage(currentPage-1)
  }

  // Calculating paginated data
  // const paginatedTutors = filteredTutors.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className='md:w-auto w-[100%] md:mx-10 md:mt-[1%] flex flex-col mt-[10%] bg-black rounded-xl p-5 shadow-lg'>
      <div className='font-serif text-2xl mb-4 text-center'>
        <h1 className='text-gray-100 font-bold'>Welcome to Tutor's Page</h1>
      </div>
      <div className='mb-4 relative'>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={'Search...'}
          className='border p-2 px-6 w-full md:w-auto rounded-xl bg-custom-gradient text-white'
        />
        <FaSearch className='absolute text-2xl ml-1 top-1/4  text-white' />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
          <thead className='bg-gray-800 text-white'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-medium'>Index</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Tutor Name</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Email</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Phone Number</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Validate</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Courses</th>
            </tr>
          </thead>
          <tbody className='bg-custom-gradient bg-opacity-20'>
            {filteredTutors.map((tutor, index) => (
              <tr key={tutor._id} className='border-t border-gray-200 hover:bg-gray-900'>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{indexOfFirstUser  + index + 1}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{tutor.tutorname}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{tutor.email}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{tutor.phonenumber}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>
                  <button
                    onClick={() => handleValidateClick(tutor._id)}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                  >
                    Validate
                  </button>
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>
                  <button
                    onClick={() => handleCoursesClick(tutor._id)}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                  >
                    Courses
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-center gap-4 items-center'>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Previous
        </button>
        <span className='text-gray-100'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage==totalPages}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TutorListing;
