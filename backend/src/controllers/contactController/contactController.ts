import {Request,Response,NextFunction } from "express";
import CourseModel from "../../models/courseModel";
import BookingModel from "../../models/BookingRequestModel";
import mongoose from "mongoose";
import Notification from "../../models/notificationModel";

export const videoCallBooking=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
    const {courseId,name,email,purpose,description}=req.body
    try {
        const userId = req.userId;

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


            export const getCallRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
              console.log('started')
                try {
                    const tutorId = req.userId;
                    const courseId = req.query.courseId as string;
                    const page:number=parseInt(req.query.page as string)||1
                    const limit:number=parseInt(req.query.limit as string)||10
                    const skip:number=(page-1)*limit

                    if (page < 1 || limit < 1) {
                      return res.status(400).json({ message: 'Invalid page or limit parameters' });
                  }
            
                    const tutorObjectId = new mongoose.Types.ObjectId(tutorId);
                    const courseObjectId = new mongoose.Types.ObjectId(courseId);
            
                    console.log('courseId:', courseObjectId);
                    console.log('tutorId:', tutorObjectId);
                    const totalDoc = await BookingModel.countDocuments({
                      tutorId: tutorObjectId,
                      courseId: courseObjectId,
                  });
                                       console.log('totalSoc',totalDoc) 
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
            },{
              $skip:skip
            },{
              $limit:limit
            }
                       
                    ]);
                    console.log('get',getAllCallRequest)
            const totalPages=Math.ceil(totalDoc/limit)
                    console.log('d', getAllCallRequest);
                    res.json({getAllCallRequest,totalPages});
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
                 console.log('upda',updatedBooking)
                  if (!updatedBooking) {
                    return res.status(404).json({ message: 'Booking not found' });
                  }
                  const bookingNotification=new Notification({
                    studentId: booking?.studentId,
                    courseId:booking?.courseId,
                    tutorId: tutorId, 
                    type:'booking',
            message: `Your booking for ${date} has been approved by the tutor.`, 
            isGlobal: false 
                  })
                  await bookingNotification.save()
              console.log('bookNot',bookingNotification)
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
                console.log('courseId',CourseId)
                const StudentId=req.userId
                // console.log('studentId',StudentId)
                const courseId=new mongoose.Types.ObjectId(CourseId)
                const studentId=new mongoose.Types.ObjectId(StudentId)
                const booking=await BookingModel.aggregate([
                    {
                        $match:{studentId:studentId,courseId:courseId,  status: { $in : ['pending', 'accepted','approved'] }
                        }
                    } 
                ])  
                console.log('book',booking)
                res.json({bookingResult:booking[0]}) 
              }


              export const sendIdToStudent = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
                try {
                  console.log('Request Body:', req.body);
                  console.log('Query Parameters:', req.query);
              
                  const {callId}  = req.body;
                  console.log('ca',callId)
                  const bookingId = req.query.id as string;
                 console.log('book',bookingId) 
                  const booking = await BookingModel.findById(bookingId);
                                    console.log('Booking:', booking);

                  if (!booking) {
                    return res.status(404).json({ message: 'Booking not found' });
                  }
              
              
                  booking.callId = callId;
                  await booking.save(); 
                  console.log('newbookin',booking)
              
                  res.status(200).json({ message: 'Call ID updated successfully' });
                } catch (error) {
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
                      bookingId, 
                      {
                        $set: {
                          callId: '', 
                          status: 'completed' 
                        }
                      },
                      { new: true } 
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
               