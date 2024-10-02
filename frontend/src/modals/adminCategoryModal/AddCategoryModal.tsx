import React, { useEffect } from 'react';
import { EditTutor } from '../../types/modalTypes/EditModat';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import api from '../../components/API/Api';
import { useDispatch } from 'react-redux';
import { setEachCategory } from '../../redux/admin/adminSlice';

interface AddCategoryModalProps extends EditTutor {
  fetchAllCategory: (page: number, limit: number) => Promise<void>;
  isEditable?: boolean;
  categoryToEdit?: { _id: string; categoryName: string; catDescription: string } | null; // Updated to include null
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  fetchAllCategory,
  isEditable,
  categoryToEdit
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      catDescription: ''
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required('Category Name is required')
        .min(2, 'Category Name must be at least 3 characters'),
      catDescription: Yup.string()
        .required('Category Description is required')
        .min(10, 'Category Description must be at least 10 characters'),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save the changes?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append('categoryName', values.categoryName);
          formData.append('catDescription', values.catDescription);

          try {
            let response;
            if (isEditable && categoryToEdit) {
              response = await api.put(`/backend/admin/updateCategory/${categoryToEdit._id}`, formData, {
                headers: {
                  'X-Token-Type': 'admin'
                },
              });
            } else {
              response = await api.post('/backend/admin/addCategory', formData, {
                headers: {
                  'X-Token-Type': 'admin'
                },
              });
            }
            dispatch(setEachCategory(response.data.category));
            Swal.fire(
              'Saved!',
              'Your changes have been saved.',
              'success'
            );
            onClose();
            fetchAllCategory(1,10);

          } catch (error) {
            console.error('Error:', error);
            Swal.fire(
              'Error!',
              'Something went wrong.',
              'error'
            );
          }
        }
      });
    }
  });

  // Update form values when categoryToEdit changes
  useEffect(() => {
    if (categoryToEdit) {
      formik.setValues({
        categoryName: categoryToEdit.categoryName,
        catDescription: categoryToEdit.catDescription
      });
    } else {
      formik.resetForm(); // Reset form if no categoryToEdit
    }
  }, [categoryToEdit]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
      <div className='relative bg-custom-gradient w-[60%] rounded-lg p-5'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-thin text-white'>{isEditable ? 'Edit Category' : 'Add Category'}</h1>
          <button
            className='text-white text-2xl font-bold focus:outline-none'
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className='p-4 space-y-6 w-full flex justify-center items-center'>
          <form onSubmit={formik.handleSubmit} className='w-full max-w-md'>
            <div className='mb-4'>
              <input
                className='w-full p-2 rounded-xl'
                type='text'
                name='categoryName'
                placeholder='Category Name'
                value={formik.values.categoryName}
                onChange={formik.handleChange}
              />
              {formik.touched.categoryName && formik.errors.categoryName ? (
                <div className='text-red-500'>{formik.errors.categoryName}</div>
              ) : null}
            </div>
            <div className='mb-4'>
              <textarea
                className="w-full p-2 rounded-xl"
                name='catDescription'
                placeholder="Category description"
                rows={8}
                value={formik.values.catDescription}
                onChange={formik.handleChange}
              />
              {formik.touched.catDescription && formik.errors.catDescription ? (
                <div className='text-red-500'>{formik.errors.catDescription}</div>
              ) : null}
            </div>
            <div className='text-center'>
              <button type='submit' className='bg-slate-400 p-3 font-bold text-white rounded-xl w-full'>
                {isEditable ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
