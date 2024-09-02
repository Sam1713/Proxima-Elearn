import {Request,Response,NextFunction } from "express";
import CourseModel from "../../models/courseModel";
import BookingModel from "../../models/BookingRequestModel";
import mongoose from "mongoose";

export const videoCallBooking=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
    const {courseId,name,email,purpose,description}=req.body
    try {
        const userId = req.userId;

        // Find the course and get the associated tutor ID
        const tutorDetails = await CourseModel.findById(courseId);
        if (!tutorDetails || !tutorDetails.tutorId) {
            return res.status(404).json({ error: 'Tutor not found for the course' });
        }

        const tutorId = tutorDetails.tutorId;

        const newBooking = new BookingModel({
            name,
            email,
            purpose,
            description,
            courseId,
            tutorId:tutorId,
            studentId: userId,
            status: 'pending'
        });

        await newBooking.save();
        console.log('new B',newBooking)

        res.status(201).json({ message: 'Booking successfully created', booking: newBooking });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while creating the booking' });
    }
};


            export const getCallRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    const tutorId = req.userId;
                    const courseId = req.query.courseId as string;
            
                    // Convert IDs to ObjectId
                    const tutorObjectId = new mongoose.Types.ObjectId(tutorId);
                    const courseObjectId = new mongoose.Types.ObjectId(courseId);
            
                    console.log('courseId:', courseObjectId);
                    console.log('tutorId:', tutorObjectId);
            
                    // Aggregate query
                    const getAllCallRequest = await BookingModel.aggregate([
                        {
                            $match: {
                                tutorId: tutorObjectId,
                                courseId: courseObjectId,
                            },
                        },
                        {
                            $lookup:{
                                from:'students',
                                localField:'studentId',
                                foreignField:'_id',
                                as:'Student'
                            }
                        },
                        {
                            $unwind:{path:"$Student"}
                        },
                        {
                $project: {
                    _id: 1,
                    name:1,
                    email:1,
                    purpose: 1,
                    description: 1,
                    status: 1,
                    courseId: 1,
                    tutorId: 1,
                    studentId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    profilePic: "$Student.profilePic" // Include profile picture from the student document
                },
            },
            {
                $sort:{createdAt:-1}
            }
                       
                    ]);
            
                    console.log('d', getAllCallRequest);
                    res.json(getAllCallRequest);
                } catch (error) {
                    console.error('Error fetching call requests:', error);
                    res.status(500).json({ error: 'An error occurred while fetching call requests.' });
                }
            };
            
            interface Booking {
                date?: Date;
                startingTime?: string;
                endingTime?: string;
                notes?: string;
                status?: string;
                // Include other fields as necessary
              }
              
            export const tutorApproveRequest=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
                try {
                const bookingId=req.query.bookingId as string
                const {date,startingTime,endingTime,notes}=req.body
                console.log('afd',notes)
                console.log('id',bookingId)
                const tutorId=req.userId
                console.log('tut',tutorId)
                console.log('red',req.body)

                const booking=await BookingModel.findById(bookingId).lean()
                if(!booking){
                    res.json('Booked request not found')
                }
                const updatedBooking = await BookingModel.findByIdAndUpdate(
                    bookingId,
                    {
                        $set: {
                            'tutorResponse.responseDate': date,
                            'tutorResponse.startingTime': startingTime,
                            'tutorResponse.endingTime': endingTime,
                            'tutorResponse.notes': notes,
                            status: 'approved', 
                          }
                    },
                    { new: true } 
                  );
                //  console.log('upda',updatedBooking)
                  if (!updatedBooking) {
                    return res.status(404).json({ message: 'Booking not found' });
                  }
              
                  res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
                } catch (error) {
                  console.error('Error updating booking:', error);
                  res.status(500).json({ message: 'Server error' });
                }
              };

              export const getFullCallDetails=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
                try{
                console.log('hai')
                const bookingId=req.params.id
                console.log('id',bookingId)
                const booking=await BookingModel.findById(bookingId)
                // console.log('book',booking)
                if(!booking){
                    res.json('No booking Details found')
                }
                res.json(booking)
                }catch(error){
                    console.log('err',error)
                }
              }

              export const getCallData=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
                const CourseId=req.params.id
                // console.log('courseId',CourseId)
                const StudentId=req.userId
                // console.log('studentId',StudentId)
                const courseId=new mongoose.Types.ObjectId(CourseId)
                const studentId=new mongoose.Types.ObjectId(StudentId)
                const booking=await BookingModel.aggregate([
                    {
                        $match:{studentId:studentId,courseId:courseId}
                    }
                ])
                console.log('book',booking)
                res.json({bookingResult:booking[0]})
              }


              export const sendIdToStudent = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
                try {
                  // Log the request body and query parameters
                  console.log('Request Body:', req.body);
                  console.log('Query Parameters:', req.query);
              
                  // Extract data from request
                  const {callId}  = req.body;
                  console.log('ca',callId)
                  const bookingId = req.query.id as string;
              
                  // Find the booking from the database
                  const booking = await BookingModel.findById(bookingId);
                  if (!booking) {
                    // Handle case where booking is not found
                    return res.status(404).json({ message: 'Booking not found' });
                  }
              
                  console.log('Booking:', booking);
              
                  // Update the booking with the new callId
                  booking.callId = callId;
                  await booking.save(); 
                  console.log('newbookin',booking)
              
                  // Respond with a success message
                  res.status(200).json({ message: 'Call ID updated successfully' });
                } catch (error) {
                  // Handle errors
                  console.error('Error updating call ID:', error);
                  res.status(500).json({ message: 'Internal server error' });
                }
              };

              
              export const leaveCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                  const bookingId = req.query.id as string;
                  console.log('book', bookingId);
              
                  const booking = await BookingModel.findById(bookingId);
                  console.log('new', booking);
              
                  if (booking) {
                    const updateBooking = await BookingModel.findByIdAndUpdate(
                      bookingId, // ID of the booking to update
                      {
                        $set: {
                          callId: '', // Clear the call ID
                          status: 'completed' // Set status to completed
                        }
                      },
                      { new: true } // Return the updated document
                    );
              
                    console.log('Updated booking:', updateBooking);
                    res.status(200).json({ message: 'Call ended successfully', booking: updateBooking });
                  } else {
                    res.status(404).json({ message: 'Booking not found' });
                  }
                } catch (error) {
                  console.error('Error leaving the call:', error);
                  res.status(500).json({ message: 'Internal server error' });
                }
              };
              