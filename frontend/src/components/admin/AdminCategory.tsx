import React, { useEffect, useState } from 'react';
import AddCategoryModal from '../../modals/adminCategoryModal/AddCategoryModal';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAllCategory } from '../../redux/admin/adminSlice';
import Swal from 'sweetalert2';
import { Button } from '@material-tailwind/react';

const AdminCategory: React.FC = () => {
  const dispatch = useDispatch();
  const allCategory = useSelector((state: RootState) => state.admin.viewAllCategory);
  const [openCat, setOpenCat] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<{ _id: string; categoryName: string; catDescription: string } | null>(null);
  
  // Search, sort, and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc'); // or 'desc'
  const [filteredCategories, setFilteredCategories] = useState(allCategory);
  const [page,setPage]=useState<number>(1)
  const [totalPage,setTotalPage]=useState<number>(1)
  const limit=4
 console.log('sdsfd',allCategory)
  useEffect(() => {
    fetchAllCategory(page,limit);
  }, [dispatch,page,limit]);

  useEffect(() => {
    filterAndSortCategories();
  }, [allCategory, searchTerm, sortOrder]);

  const fetchAllCategory = async (page:number,limit:number) => {
    try {
      const response = await api.get('/backend/admin/category', {
        headers: {
          'X-Token-Type': 'admin',
        },
        params:{
          page:page,
          limit:limit
        }
      });
      dispatch(setAllCategory(response.data.getAllCategory)); // Ensure response.data is Category[]
      setTotalPage(response.data.totalPage)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAndSortCategories = () => {
    let categories = [...allCategory]; // Create a shallow copy of the array

    // Filter
    if (searchTerm) {
      categories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    categories.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.categoryName.localeCompare(b.categoryName);
      } else {
        return b.categoryName.localeCompare(a.categoryName);
      }
    });

    setFilteredCategories(categories);
  };

  const handleCategoryOpen = () => {
    setOpenCat(true);
    setIsEditable(false);
    setCategoryToEdit(null);
  };

  const handleCategoryClose = () => {
    setOpenCat(false);
  };

  const handleEdit = (category: { _id: string; categoryName: string; catDescription: string }) => {
    setOpenCat(true);
    setIsEditable(true);
    setCategoryToEdit(category);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  };

  const handleDeleteCategory=async(id:string)=>{
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
    try{
      
    const response=await api.delete(`/backend/admin/deleteCategory/${id}`,{
      headers:{
        'X-Token-Type':'admin'
      }
    })
      console.log('res',response)
      fetchAllCategory(page,limit);


    Swal.fire({
      title: 'Approved!',
      text: 'The tutor has been approved.',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }
  catch(error){
    console.log('err',error)
  }
    }
  
  }

  return (
    <div className=" pl-10 p-4 w-full md:w-[100%] ">
      <div className="container mx-auto bg-black w-full  shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Manage Categories</h1>

        <div className="md:flex md:items-center w-full md:w-auto md:justify-between mb-4">
          <button
            onClick={handleCategoryOpen}
            className="bg-blue-500 w-full md:w-auto mb-4 md:mb-0 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add Category
          </button>

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 rounded border border-gray-300 shadow-sm "
            />
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="p-2 rounded border border-gray-300 shadow-sm w-[40%] md:w-auto"
            >
              <option value="asc">Sort Ascending</option>
              <option value="desc">Sort Descending</option>
            </select>
          </div>
        </div>

        <div className="bg-custom-gradient  mt-4 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Existing Categories</h2>
          <ul>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <li
                  key={category._id}
                  className="bg-white text-gray-800 rounded-lg p-4 mb-3 shadow-sm flex justify-between items-center"
                >
                  <span className="font-medium">{category.categoryName}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(category)} 
                      className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button 
                    onClick={()=>handleDeleteCategory(category?._id)}
                      className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No categories found.</li>
            )}
          </ul>
        </div>
      </div>
      <div className='flex justify-center items-center space-x-4'>
  <div>
    <Button 
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      Prev
    </Button>
  </div>
  <span className='text-lg font-semibold'>
    {page} - {totalPage}
  </span>
  <div>
    <Button 
            disabled={page === totalPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ${page === totalPage ? 'opacity-50 cursor-not-allowed' : ''}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      Next
    </Button>
  </div>
</div>


      <AddCategoryModal 
        isOpen={openCat} 
        onClose={handleCategoryClose} 
        fetchAllCategory={fetchAllCategory} 
        isEditable={isEditable} 
        categoryToEdit={categoryToEdit} 
      />
    </div>
  );
};

export default AdminCategory;
