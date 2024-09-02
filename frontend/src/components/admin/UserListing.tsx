import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, usePagination, useSortBy } from 'react-table';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { adminUsersFetch } from '../../redux/admin/adminSlice';
import { RootState } from '../../redux/store';
import userIcon from '../../assets/images/OIP (32).jpeg';
import api from '../API/Api';
import { signInSuccess } from '../../redux/student/studentSlice';
import Swal from 'sweetalert2';

const GlobalFilterComponent = ({ globalFilter, setGlobalFilter }) => (
  <span className='relative'>
    <input
      value={globalFilter || ''}
      onChange={e => setGlobalFilter(e.target.value || undefined)}
      placeholder={'Search...'}
      className='relative border p-2 px-6 rounded-xl bg-custom-gradient text-white'
    />
    <FaSearch className='md:absolute absolute ml-1 md:top-1/4 text-white' />
  </span>
);

function UserListing() { 
  const dispatch = useDispatch();
  const adminUsers = useSelector((state: RootState) => state.admin.adminUsers);
  const currentUser = useSelector((state: RootState) => state.student.currentStudent);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/backend/admin/userlisting', {
          headers: {
            'X-Token-Type': 'admin',
          },
        });
        dispatch(adminUsersFetch(response.data));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleValidateClick = async (id: string, isBlocked: boolean) =>
     {
      const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to block this tutor?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel'
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
        confirmButtonText: 'OK'
      });
    } 
  
  catch (error) {
    console.error('Error approving tutor:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to approve the tutor. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
  };
  console.log('curr',currentUser)

  const columns = useMemo(() => [
    {
      Header: 'Index',
      id: 'index',
      disableFilters: true,
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: 'UserName',
      accessor: 'username',
      Filter: () => null,
    },
    {
      Header: 'Email',
      accessor: 'email',
      Filter: () => null,
    },
    {
      Header: 'Profile Pic',
      accessor: 'profilePic',
      Filter: () => null,
      Cell: ({ value }) => (
        <img
          src={value || userIcon}
          alt="Profile"
          className='rounded-full'
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => {
        const user = row.original;
        return (
          <button
            onClick={() => handleValidateClick(user._id, user.isBlocked)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {user.isBlocked ? 'Unblock' : 'Block'}
          </button>
        );
      },
      disableFilters: true,
    },
  ], [adminUsers]);

  const data = useMemo(() => adminUsers, [adminUsers]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, globalFilter: tableGlobalFilter },
    setGlobalFilter: setTableGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 4 },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div className='md:w-[75%] w-[90%] mx-auto md:mt-[1%] flex flex-col md:h-[85vh] mt-[10%] bg-custom-gradient rounded-xl p-5 shadow-lg'>
      <div className='font-serif text-2xl mb-4 text-center'>
        <h1 className='text-gray-100 font-bold'>Welcome to User's Page</h1>
      </div>
      <div className='mb-4'>
        <GlobalFilterComponent globalFilter={tableGlobalFilter} setGlobalFilter={setTableGlobalFilter} />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md' {...getTableProps()}>
          <thead className='bg-gray-800 text-white'>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className='px-6 py-3 text-left text-sm font-medium cursor-pointer'
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className='bg-custom-gradient bg-opacity-20'>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className='border-t border-gray-200 hover:bg-gray-900'>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className='px-6 py-4 text-sm font-medium text-gray-100'>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-center gap-4 items-center'>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Previous
        </button>
        <span className='text-gray-100'>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Next
        </button>
      </div>
    </div>
  );
}

export default UserListing;
