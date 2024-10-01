import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable, useGlobalFilter, useFilters, usePagination, useSortBy } from 'react-table';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { adminStoreEachTutorDetail, adminStoreTutorDetails } from '../../redux/admin/adminSlice';
import { RootState } from '../../redux/store';
import { FaSearch } from "react-icons/fa";
import { response } from 'express';

// Custom Global Filter component
const GlobalFilterComponent = ({ globalFilter, setGlobalFilter }: any) => (
  <span className='relative'>
  <input
    value={globalFilter || ''}
    onChange={e => setGlobalFilter(e.target.value || undefined)}
    placeholder={'Search...'}
    className='relative border p-2 px-6 w-full md:w-auto  rounded-xl bg-custom-gradient text-white'
  />
   <FaSearch  className='md:absolute absolute text-2xl md:text-sm  ml-1 md:top-1/4 right-5 top-0  md:right-auto  text-white' />
  </span>
  
);

const TutorListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const tutorDetails = useSelector((state: RootState) => state.admin.tutorDetails);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        const response = await axios.get('/backend/admin/tutorlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log('API response data:', response.data);

        // Dispatch the fetched data to Redux store
        dispatch(adminStoreTutorDetails(response.data));
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, [dispatch]);

  const handleValidateClick = async(id: string) => {

 const token = localStorage.getItem('admin_access_token');
      console.log('Fetched token:', token);
    
      if (!token) {
        throw new Error('No token found');
      }
    
      try {
        const response = await axios.get(`/backend/admin/tutorDetails/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
    })
    dispatch(adminStoreEachTutorDetail(response.data))
    navigate(`/admin/tutorDetails/${id}`);

    console.log('res',response)
  }catch(error){
    console.log(error)
  }
  }
 const handleCoursesClick=(id:string)=>{
  navigate(`/admin/tutorCourses/${id}`)
 }
  const columns = useMemo(
    () => [
      {
        Header: 'Index',
        id: 'index',
        disableFilters: true, // Disable filtering for this column if necessary
        Cell: ({ row }: { row: { index: number } }) => row.index + 1, // Add 1 to index for 1-based numbering
      },
      {
        Header: 'Tutor Name',
        accessor: 'tutorname',
        Filter: () => null, // Optional: Disable column filtering if needed
      },
      {
        Header: 'Email',
        accessor: 'email',
        Filter: () => null, // Optional: Disable column filtering if needed
      },
      {
        Header: 'Phone Number',
        accessor: 'phonenumber',
        Filter: () => null, // Optional: Disable column filtering if needed
      },
      {
        Header: 'Validate',
        Cell: ({ row }: { row: { original: { _id: string } } }) => (
          <button
            onClick={() => handleValidateClick(row.original._id)}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Validate
          </button>
        ),
        disableFilters: true, // Disable filtering for this column
      },
      {
        Header: 'Courses',
        Cell: ({ row }: { row: { original: { _id: string } } }) => (
          <button
            onClick={() => handleCoursesClick(row.original._id)}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Courses
          </button>
        ),
        disableFilters: true, // Disable filtering for this column
      },
    ],
    []
  );

  const data = useMemo(() => tutorDetails, [tutorDetails]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use `page` for pagination instead of `rows`
    prepareRow,
    state: { pageIndex, pageSize, globalFilter: tableGlobalFilter }, // Renamed the state variable here
    setGlobalFilter: setTableGlobalFilter, // Renamed the setter function here
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    nextPage,
    previousPage,
    state
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 4 }, // Set page size to 4
    },
    useGlobalFilter,
    useFilters,
    useSortBy, // Include sorting
    usePagination
  );

  return (
    <div className='md:w-auto w-[100%] md:mx-10 md:mt-[1%]   flex flex-col  mt-[10%] bg-black rounded-xl p-5 shadow-lg'>
      <div className='font-serif text-2xl mb-4 text-center'>
        <h1 className='text-gray-100 font-bold'>Welcome to Tutor's Page</h1>
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
            {page.map(row => { // Use `page` instead of `rows`
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
};

export default TutorListing;
