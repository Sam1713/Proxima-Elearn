import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import api from '../../components/API/Api'; // Make sure axios is imported correctly
import { useDispatch, useSelector } from "react-redux";
import { setCallRequestAccept } from "../../redux/tutor/tutorSlice";
import { RootState } from "../../redux/store";

interface ApproveType {
    isOpen: boolean;
    onClose: () => void;
    id: string;
    courseId: string; // Add this line
    fetchCallRequest: (courseId: string) => void;
  }
  
const today = new Date();
today.setHours(0, 0, 0, 0);

const ApproveBookingModal: React.FC<ApproveType> = ({ isOpen, onClose, id,courseId,fetchCallRequest }) => {
    const dispatch=useDispatch()
    const booking=useSelector((state:RootState)=>state.tutor.CallRequestAccept)
    console.log('if',id)
  const formik = useFormik({
    initialValues: {
      date: null,
      startingTime: null,
      endingTime: null,
      notes: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .min(today, "Date cannot be in the past"),
      startingTime: Yup.date()
        .nullable()
        .required("Starting time is required"),
      endingTime: Yup.date()
        .nullable()
        .required("Ending time is required")
        .test(
          "is-after",
          "Ending time must be after starting time",
          function (value) {
            const { startingTime } = this.parent;
            return !value || !startingTime || value > startingTime;
          }
        ),
    }),
    onSubmit: async (values) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to submit the form?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit it!',
          customClass: {
            container: 'swal2-container',
          }
        });

        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append('date', values.date?.toISOString().split('T')[0] || '');
          formData.append('startingTime', values.startingTime 
            ? values.startingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
            : ''
          );
          formData.append('endingTime', values.endingTime 
            ? values.endingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
            : ''
          );
          formData.append('notes', values.notes);

          try {
            const response = await api.post('/backend/contact/approveRequest', formData, {
              headers: {
                'X-Token-Type': 'tutor'
              },
              params:{
                bookingId:id
              }
            });
            console.log('Response:', response);
            dispatch(setCallRequestAccept(response.data.booking))
            Swal.fire('Success!', 'Your request has been submitted.', 'success');
            fetchCallRequest(courseId)
            onClose(); // Close the modal after successful submission
          } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error!', 'There was an error submitting your request.', 'error');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error!', 'There was an error processing your request.', 'error');
      }
    },
  });

  const handleDateChange = (date: Date | null) => {
    formik.setFieldValue("date", date);
  };

  const handleTimeChange = (field: string) => (date: Date | null) => {
    formik.setFieldValue(field, date);
  };

  return (
    <Dialog
      open={isOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="max-w-lg mx-auto bg-custom-gradient font-serif"
    >
      <DialogHeader className="text-lg font-bold text-indigo-600 font-serif">
        Approve Booking Request
      </DialogHeader>
      <form onSubmit={formik.handleSubmit}>
        <DialogBody className="h-auto space-y-4">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-100 flex items-center mb-2">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Date
              </label>
              <DatePicker
                selected={formik.values.date}
                onChange={handleDateChange}
                placeholderText="Select a date"
                dateFormat="yyyy-MM-dd"
                className="w-full bg-custom-gradient text-white border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:border-indigo-400"
              />
              {formik.touched.date && formik.errors.date ? (
                <div className="text-red-500 text-sm">{formik.errors.date}</div>
              ) : null}
            </div>

            <DatePicker
              selected={formik.values.startingTime}
              onChange={handleTimeChange("startingTime")}
              placeholderText="Starting time"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeFormat="hh:mm aa"
              dateFormat="hh:mm aa"
              className="w-full p-3 bg-custom-gradient text-white border border-indigo-100 rounded-md"
            />
            {formik.touched.startingTime && formik.errors.startingTime ? (
              <div className="text-red-500 text-sm">{formik.errors.startingTime}</div>
            ) : null}

            <DatePicker
              selected={formik.values.endingTime}
              onChange={handleTimeChange("endingTime")}
              placeholderText="Ending time"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeFormat="hh:mm aa"
              dateFormat="hh:mm aa"
              className="w-full p-3 bg-custom-gradient text-white border border-indigo-100 rounded-md"
            />
            {formik.touched.endingTime && formik.errors.endingTime ? (
              <div className="text-red-500 text-sm">{formik.errors.endingTime}</div>
            ) : null}

            <Textarea
              value={formik.values.notes}
              onChange={(e) => formik.setFieldValue("notes", e.target.value)}
              className="border border-indigo-300 rounded-xl text-white bg-transparent focus:ring-0 focus:border-indigo-300"
              placeholder="Add any additional notes..."
              rows={4}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="red"
            onClick={onClose}
            className="mr-1 hover:bg-red-50 transition duration-300 ease-in-out"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            color="green"
            className="bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition duration-300 ease-in-out"
          >
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default ApproveBookingModal;
