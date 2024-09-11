import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FaCalendarAlt, FaClock, FaStickyNote } from 'react-icons/fa';
import { MdEmail, MdPerson } from 'react-icons/md';
import { useParams } from "react-router-dom";
import BookingModal from "../../modals/videocall/BookingModal";
import api from '../API/Api';
import { ImSpinner2 } from 'react-icons/im'; // Spinner icon
import JoinCallButton from "./JoinCallButton";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardIcon } from '@heroicons/react/24/outline'; // Clipboard icon
import { useDispatch, useSelector } from "react-redux";
import { setCallDetails } from "../../redux/student/studentSlice";
import { RootState } from "../../redux/store";

function BookingCall() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const dispatch = useDispatch();
  const bookingDetails = useSelector((state: RootState) => state.student.callDetails);
  console.log('nno',booking)
  const bookId=useSelector((state:RootState)=>state.student.bookingId)
  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    fetchCallData();
  }, []);

  const fetchCallData = async () => {
    try {
      const response = await api.get(`/backend/contact/getCallData/${id}`, {
        headers: {
          'X-Token-Type': 'student'
        },
       
      });
      console.log('res', response);
      
      setBooking(response.data.bookingResult);
      dispatch(setCallDetails(response.data.bookingResult));
    } catch (error) {
      console.log('err', error);
    }
  };
console.log('book',bookingDetails)
  return (
    <div className="py-20 bg-custom-gradient min-h-screen flex flex-col items-center font-serif">
{(bookingDetails?.status === 'default' || bookingDetails?.status === 'completed' || bookingDetails ===undefined||bookingDetails===null ) ? (
        <> 
        <div className="flex flex-col m-auto">
        <Button
            onClick={handleOpen}
            variant="gradient"
            className=" text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition duration-300 ease-in-out p-8"
          >
            Book a Slot
          </Button>
          <BookingModal open={open} handleOpen={handleOpen} id={id} fetchCallData={fetchCallData} />
          <div className="m-auto flex items-center justify-center mt-5">
          <Typography variant="h4" className="text-gray-100 mb-4 font-poppins">No Booking Found</Typography>
          </div>
        </div>
        </>
      ) : (
        <div className="w-full max-w-4xl bg-white bg-opacity-5 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="text-gray-100 font-poppins underline">Booking Details</Typography>
          </div>

          <div className="flex justify-end mb-6">
            <Button
              onClick={handleOpen}
              variant="gradient"
              disabled={bookingDetails?.status !=='completed'}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition duration-300 ease-in-out"
            >
              Book a Call
            </Button>
            <BookingModal open={open} handleOpen={handleOpen} id={id} />
          </div>

          {/* Call Request Details */}
          <div className="bg-custom-gradient p-6 rounded-2xl shadow-xl mb-6 font-serif">
            <Typography variant="h4" className="font-semibold text-gray-100 mb-4">Call Request Details</Typography>
            <div className="space-y-4">
              <div className="flex items-center">
                <MdPerson className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className="text-gray-300">{bookingDetails?.name}</Typography>
              </div>
              <div className="flex items-center">
                <MdEmail className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className="text-gray-300">{bookingDetails?.email}</Typography>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className="text-gray-300">{bookingDetails?.purpose}</Typography>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className={`${bookingDetails?.status === 'approved' ? 'bg-green-500 text-gray-100 rounded-xl p-3' : 'bg-red-400 text-gray-100 rounded-xl p-3'} text-gray-300 p-2`}>{booking?.status}</Typography>
              </div>
              <div className="flex items-center">
                <FaClock className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className="text-gray-300">{bookingDetails?.createdAt}</Typography>
              </div>
              <div className="flex items-start">
                <FaStickyNote className="text-2xl text-gray-600 mr-2" />
                <Typography variant="body1" className="text-gray-300">{bookingDetails?.description}</Typography>
              </div>
            </div>
          </div>

          {/* Tutor Response */}
          <div className="bg-custom-gradient p-6 rounded-lg shadow-md mb-6">
            <Typography variant="h4" className="font-semibold text-gray-100 mb-4 font-serif">Tutor Response</Typography>
            {booking?.tutorResponse ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-2xl text-gray-600 mr-2" />
                  <Typography variant="body1" className="text-gray-300">Response Date: {bookingDetails?.tutorResponse?.responseDate}</Typography>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-2xl text-gray-600 mr-2" />
                  <Typography variant="body1" className="text-gray-300">Start Time: {booking?.tutorResponse?.startingTime}</Typography>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-2xl text-gray-600 mr-2" />
                  <Typography variant="body1" className="text-gray-300">End Time: {bookingDetails?.tutorResponse?.endingTime}</Typography>
                </div>
                <div className="flex items-start">
                  <FaStickyNote className="text-2xl text-gray-600 mr-2" />
                  <Typography variant="body1" className="text-gray-300">{bookingDetails?.tutorResponse?.notes}</Typography>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImSpinner2 className="text-4xl text-white animate-spin mb-4" />
                <Typography variant="h6" className="text-gray-300">Awaiting Tutor Response...</Typography>
                <Typography variant="body2" className="text-gray-400">The tutor hasn't responded yet. Please check back later.</Typography>
              </div>
            )}
          </div>

          {/* Video Call Information */}
          {booking?.callId ? (
            <div className="bg-custom-gradient p-6 rounded-lg shadow-md">
              <Typography variant="h4" className="font-semibold text-gray-100 mb-4">Video Call Information</Typography>
              <div className="flex items-center space-x-4">
                <Typography variant="body1" className="text-gray-300 font-poppins">Call ID: {bookingDetails?.callId}</Typography>
                <CopyToClipboard  text={bookingDetails?.callId}>
                  <Button variant="gradient" className="bg-blue-500 text-white flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5" />
                    <span>Copy Call ID</span>
                  </Button>
                </CopyToClipboard>
              </div>
              <div className="mt-4">
                <JoinCallButton />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImSpinner2 className="text-4xl text-white animate-spin mb-4" />
              <Typography variant="h6" className="text-gray-300">Loading Call Information...</Typography>
              <Typography variant="body2" className="text-gray-400">Please wait while we retrieve the call details.</Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingCall;
