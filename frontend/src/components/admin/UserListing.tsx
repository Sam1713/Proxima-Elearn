import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminUsersFetch } from '../../redux/admin/adminSlice';
import { RootState } from '../../redux/store';
import userIcon from '../../assets/images/OIP (32).jpeg';
import api from '../API/Api';
import { signInSuccess } from '../../redux/student/studentSlice';
import Swal from 'sweetalert2';
import { FaSearch } from 'react-icons/fa';

// Define types for user objects
interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  isBlocked: boolean;
}

interface GlobalFilterProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalFilterComponent: React.FC<GlobalFilterProps> = ({ filter, setFilter }) => (
  <span className='relative'>
    <input
      value={filter}
      onChange={e => setFilter(e.target.value)}
      placeholder='Search...'
      className='relative border p-2 px-6 rounded-xl bg-custom-gradient text-white'
    />
    <FaSearch className='md:absolute absolute ml-1 md:top-1/4 text-white' />
  </span>
);

const UserListing: React.FC = () => {
  const dispatch = useDispatch();
  const adminUsers = useSelector((state: RootState) => state.admin.adminUsers) as User[];

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 4;

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/backend/admin/userlisting', {
        headers: {
          'X-Token-Type': 'admin',
        },
      });
      dispatch(adminUsersFetch(response.data.users));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidateClick = async (id: string, isBlocked: boolean) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to block this tutor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const updatedUsers = adminUsers.map(user =>
          user._id === id ? { ...user, isBlocked: !isBlocked } : user
        );
        dispatch(adminUsersFetch(updatedUsers));

        const response = await api.put(`/backend/admin/blockOrUnblock/${id}`, {}, {
          headers: {
            'X-Token-Type': 'admin',
          },
        });

        dispatch(signInSuccess(response.data.user));
        Swal.fire({
          title: 'Blocked!',
          text: 'The user has been blocked.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Error approving tutor:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to approve the tutor. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const filteredUsers = adminUsers.filter(user =>
    user.username.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.username.localeCompare(b.username);
    }
    return b.username.localeCompare(a.username);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error}</div>;
  if (!adminUsers || adminUsers.length === 0) return <div>No users available</div>;

  return (
    <div className='w-[90%] md:w-auto md:mx-10 md:mt-[1%] flex flex-col mt-[10%] bg-black rounded-xl p-5 shadow-lg'>
      <div className='font-serif text-2xl mb-4 text-center'>
        <h1 className='text-gray-100 font-bold'>Welcome to User's Page</h1>
      </div>
      <div className='mb-4'>
        <GlobalFilterComponent filter={filter} setFilter={setFilter} />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
          <thead className='bg-gray-800 text-white'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-medium'>Index</th>
              <th onClick={handleSort} className='px-6 py-3 text-left text-sm font-medium cursor-pointer'>
                Username {sortOrder === 'asc' ? '🔼' : '🔽'}
              </th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Email</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Profile Pic</th>
              <th className='px-6 py-3 text-left text-sm font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-custom-gradient bg-opacity-20'>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className='border-t border-gray-200 hover:bg-gray-900'>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{indexOfFirstUser + index + 1}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{user.username}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>{user.email}</td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>
                  <img
                    src={user.profilePic || userIcon}
                    alt='Profile'
                    className='rounded-full'
                    style={{ width: 50, height: 50 }}
                  />
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-100'>
                  <button
                    onClick={() => handleValidateClick(user._id, user?.isBlocked)}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                  >
                    {user?.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-center gap-4 items-center'>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Previous
        </button>
        <span className='text-gray-100'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserListing;
