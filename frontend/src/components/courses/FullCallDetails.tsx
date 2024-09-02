import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import api from "../API/Api";
import { FaCalendarAlt, FaClock, FaStickyNote, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import StartCallButton from "./StartCallButton";
import { setBookingDetails } from "../../redux/tutor/tutorSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function FullCallDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch=useDispatch()
  const bookingDetails=useSelector((state:RootState)=>state.tutor.bookingDetails)
  console.log('booking',bookingDetails)
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/backend/contact/getFullCallDetails/${id}`, {
          headers: {
            "X-Token-Type": "tutor",
          },
        });
        console.log('res',response.data)
        setBooking(response.data);
        dispatch(setBookingDetails(response.data))
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <FullCallDetailsSkeleton />
      </>
    );
  }

  if (!booking) {
    return (
      <div className="bg-custom-gradient min-h-screen flex justify-center items-center">
        <Typography variant="h5" color="white">
          Booking details not found.
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-custom-gradient min-h-screen py-24">
      <div className="w-[80%] mx-auto bg-white bg-opacity-5 shadow-lg p-8 rounded-lg">
        <Typography
          variant="h2"
          color="white"
          className="text-center mb-10 font-bold tracking-wide leading-tight"
        >
          Detailed View of Video Call Request
        </Typography>

        <Timeline>
          {/* Student's Video Call Request */}
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="p-0">
                <QuestionMarkCircleIcon className="h-12 w-12 text-white" />
              </TimelineIcon>
              <Typography variant="h4" color="white" className="font-serif leading-tight">
                Call Requested by Student
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 text-white">
              <Typography className="text-lg leading-relaxed">
                <div className="font-semibold mb-4 flex items-center">
                  <FaUserAlt className="mr-2 text-blue-500" /> {booking?.name}
                </div>
                <div className="mb-2 flex items-center">
                  <MdEmail className="mr-2 text-blue-500" /> {booking?.email}
                </div>
                <div className="mb-2 flex items-center">
                  <QuestionMarkCircleIcon className="mr-2 w-[19px] text-blue-500" />{" "}
                  {booking?.purpose}
                </div>
                <div className="flex items-center">
                  <FaStickyNote className="mr-2 text-blue-500 text-lg" /> {booking?.description}
                </div>
              </Typography>
            </TimelineBody>
          </TimelineItem>

          {/* Tutor's Response */}
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="p-0">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </TimelineIcon>
              <Typography variant="h4" color="white" className="font-serif leading-tight">
                Tutor's Response
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 text-white">
              <Typography className="text-lg leading-relaxed">
                <div className="font-semibold mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-500" />{" "}
                  {booking?.tutorResponse?.responseDate}
                </div>
                <div className="mb-2 flex items-center">
                  <FaClock className="mr-2 text-green-500" /> {booking?.tutorResponse?.startingTime}
                </div>
                <div className="mb-2 flex items-center">
                  <FaClock className="mr-2 text-green-500" /> {booking?.tutorResponse?.endingTime}
                </div>
                <div className="flex items-center">
                  <FaStickyNote className="mr-2 text-green-500" /> {booking?.tutorResponse?.notes}
                </div>
              </Typography>
            </TimelineBody>
          </TimelineItem>

          {/* Video Call Information */}
          <TimelineItem>
            <TimelineHeader>
              <TimelineIcon className="p-0">
                <VideoCameraIcon className="h-12 w-12 text-white" />
              </TimelineIcon>
              <Typography variant="h4" color="white" className="font-serif leading-tight">
                Video Call Details
              </Typography>
            </TimelineHeader>
            <TimelineBody className="text-white">
              <Typography className="text-lg leading-relaxed mb-4">
                <div className="font-semibold mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2 text-pink-500" />{" "}
                  {booking?.tutorResponse?.responseDate}
                </div>
                <div className="mb-2 flex items-center">
                  <FaClock className="mr-2 text-pink-500" /> {booking?.tutorResponse?.startingTime}
                </div>
                <div className="mb-2 flex items-center">
                  <FaClock className="mr-2 text-pink-500" /> 60 minutes
                </div>
                <div className="flex items-center">
                  <FaStickyNote className="mr-2 text-pink-500" />{" "}
                  <a href="#" className="text-blue-400 hover:underline">
                    Join Video Call
                  </a>
                </div>
              </Typography>
              <StartCallButton/>
            </TimelineBody>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}

function FullCallDetailsSkeleton() {
    return (
      <div className="bg-custom-gradient min-h-screen py-24">
        <div className="w-[80%] mx-auto bg-white bg-opacity-5 shadow-lg p-8 rounded-lg">
          {/* Skeleton for Page Heading */}
          <div className="text-center mb-8">
            <div className="h-10 w-64 mx-auto bg-gray-300 rounded-full animate-pulse" />
          </div>
  
          <div className="space-y-6">
            {/* Repeated Skeleton Structure */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-6 w-40 bg-gray-300 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-64 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-4 w-64 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-4 w-64 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-8 w-full bg-gray-300 rounded-full animate-pulse" />
                </div>
                {index === 2 && (
                  <div className="h-10 w-40 bg-gray-300 rounded-full animate-pulse mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default FullCallDetails;
