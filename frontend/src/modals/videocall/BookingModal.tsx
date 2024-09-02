import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option
} from "@material-tailwind/react";
import { FaCalendarAlt } from 'react-icons/fa';
import { MdEmail, MdPerson } from 'react-icons/md';
import { useFormik } from "formik";
import * as Yup from 'yup';
import api from '../../components/API/Api'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Ensure this import is included for styling
import './BookingModal.css'; // Adjust the path as needed
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
interface DialogComponentProps {
  open: boolean;
  handleOpen: () => void;
  id:string;
  fetchCallData:()=>void;
}

const BookingModal: React.FC<DialogComponentProps> = ({ open, handleOpen,id,fetchCallData }) => {
  const options = [
    { value: '', text: '--Choose an option--' },
    { value: 'Doubt Clearance', text: 'Doubt Clearance' },
    { value: 'To know more about Course', text: 'To know more about Course' },
    { value: 'Live examination', text: 'Live examination' },
    { value: 'Material Tailwind Angular', text: 'Material Tailwind Angular' },
    { value: 'Material Tailwind Svelte', text: 'Material Tailwind Svelte' }
  ];
  const orderedCourseDetail=useSelector((state:RootState)=>state.course.singleCourse)
 console.log('sda',id)
 const courseId=id
 
  const formik = useFormik({
    initialValues: {
        courseId: courseId || '',

      name: '',
      email: '',
      purpose: '',
      description: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Student Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      purpose: Yup.string().required('Purpose is required'),
      description: Yup.lazy((value, context) =>
        context.parent.purpose === 'Doubt Clearance'
          ? Yup.string().required('Description is required for Doubt Clearance')
          : Yup.string().notRequired()
      ),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit the form?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
        customClass: {
            container: 'swal2-container'
          }

      }).then(async (result) => {
        try {
          if (result.isConfirmed) {
            const formData = new FormData();
            // formData.append('courseId', courseId || ''); // Ensure courseId is included

            for (const key in values) {
              const value = values[key as keyof typeof values];
              formData.append(key, String(value));
            }

            try {
              const response = await api.post('/backend/contact/bookCall', formData, {
                headers: {
                  'X-Token-Type':'student'
                }
              });
              console.log('Response:', response);
              Swal.fire('Success!', 'Your request has been submitted.', 'success');
              handleOpen(); // Close the modal after successful submission
              fetchCallData()
            } catch (error) {
              console.error('Error:', error);
              Swal.fire('Error!', 'There was an error submitting your request.', 'error');
            }
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error!', 'There was an error processing your request.', 'error');
        }
      });
    }
  });

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      className="p-6 bg-custom-gradient rounded-lg shadow-xl max-w-md mx-auto z-1000" // Ensure modal z-index is lower
      style={{ zIndex: 1000 }} // Ensure this is higher than SweetAlert2's z-index

    >
      <DialogHeader className="bg-custom-gradient p-4 rounded-t-lg text-white shadow-md z-40">
        Book a Call with Tutor
      </DialogHeader>
      <DialogBody className="p-6 bg-custom-gradient">
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-4 rounded-lg shadow-md">
          <div className="flex gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-100 flex items-center">
                <MdPerson className="mr-2 text-blue-500" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full border text-white border-gray-300 bg-custom-gradient rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:border-indigo-400"
                placeholder="Your name"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-100 flex items-center mb-1">
                <MdEmail className="mr-2 text-blue-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full box-border text-white border bg-custom-gradient border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:border-indigo-400"
                placeholder="Your email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-100 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Purpose of the Call
            </label>
            <div className="w-full mt-3 text-white">
              <Select
                name="purpose"
                value={formik.values.purpose}
                onChange={(e) => formik.setFieldValue('purpose', e)}
                onBlur={formik.handleBlur}
                className="text-white"
                label="Select Purpose"
              >
                {options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.text}
                  </Option>
                ))}
              </Select>
              {formik.touched.purpose && formik.errors.purpose ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.purpose}</div>
              ) : null}
            </div>
          </div>
          {formik.values.purpose === 'Doubt Clearance' && (
            <div className="w-full mt-3 text-white">
              <textarea
                name="description"
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Short Description about doubt"
                className="w-full border border-gray-300 rounded-md p-3 bg-custom-gradient text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:border-indigo-400"
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
              ) : null}
            </div>
          )}
        </form>
      </DialogBody>
      <DialogFooter className="bg-custom-gradient p-4 rounded-b-lg">
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-2 hover:bg-red-100 transition duration-300 ease-in-out"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={formik.handleSubmit}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 transition duration-300 ease-in-out"
        >
          Submit
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default BookingModal;
