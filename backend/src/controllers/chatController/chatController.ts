import { Request,Response,NextFunction } from "express";
import TutorModel from "../../models/tutorModal";
import Chat from "../../models/chatModel";
import Student from "../../models/studentModel";
import mongoose from "mongoose";

// export const getTutorList = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
//     try {
//         const tutors = await TutorModel.aggregate([
//             {
//                 $lookup: {
//                     from: 'chats',  
//                     let: { tutorId: '$_id' },  
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $or: [
//                                         { $eq: ['$receiver', '$$tutorId'] },  
//                                         { $eq: ['$sender', '$$tutorId'] }  
//                                     ]
//                                 }
//                             }
//                         },
//                         { $sort: { createdAt: -1 } },  // Sort by createdAt (most recent first)
//                         { $limit: 1 }  // Get the latest message
//                     ],
//                     as: 'latestChat'  // Store the latest chat in this field
//                 }
//             },
//             {
//                 $unwind: { 
//                     path: '$latestChat', 
//                     preserveNullAndEmptyArrays: true  // Keep tutors without any chats
//                 }
//             },
//             {
//                 $addFields: {
//                     latestCreatedAt: { $ifNull: ['$latestChat.createdAt', new Date(0)] } 
//                 }
//             },
//             {
//                 $sort: { latestCreatedAt: -1 }  
//             },
//             {
//                 $project: {
//                     _id: 1, 
//                     tutorname: 1,  
//                     latestMessage: { $ifNull: ['$latestChat.message', 'No messages yet'] },  
//                     createdAt: {
//                         $dateToString: {
//                             format: "%Y-%m-%d %H:%M",  // Format date as YYYY-MM-DD HH:mm
//                             date: { $ifNull: ['$latestChat.createdAt', new Date(0)] },  // Use a default date if none
//                             timezone: "Asia/Kolkata"  // Adjust timezone as per your needs
//                         }
//                     }
//                 }
//             }
//         ]);

//         if (!tutors || tutors.length === 0) {
//             return res.status(404).json({ message: 'Tutors not found' });
//         }

//         console.log('tutors', tutors);
//         res.json(tutors);
//     } catch (error) {
//         next(error);
//     }
// };

export const getTutorList = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        // Step 1: Fetch all tutors from the TutorModel
        const tutors = await TutorModel.find({}, '_id tutorname'); // Only fetch _id and tutorname

        if (!tutors || tutors.length === 0) {
            return res.status(404).json({ message: 'Tutors not found' });
        }

        const tutorList = await Promise.all(tutors.map(async (tutor) => {
            const latestChat = await Chat.findOne({
                $or: [
                    { receiver: tutor._id }, 
                    { sender: tutor._id }    
                ]
            })
            .sort({ createdAt: -1 }) 
            .limit(1); 

            return {
                _id: tutor._id,
                tutorname: tutor.tutorname,
                latestMessage: latestChat ? latestChat.message : 'No messages yet', // Check if there's a message
                createdAt: latestChat ? latestChat.createdAt : new Date(0) // Return the date or a default old date
            };
        }));

       
tutorList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        res.json(tutorList);
    } catch (error) {
        next(error);
    }
};




export const postStudentMessage = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
      const { senderId, receiverId, message, createdAt, senderType } = req.body;
  
      // Convert senderId and receiverId to ObjectId if they are not already
      const senderObjectId = mongoose.Types.ObjectId.isValid(senderId) ? new mongoose.Types.ObjectId(senderId) : null;
      const receiverObjectId = mongoose.Types.ObjectId.isValid(receiverId) ? new mongoose.Types.ObjectId(receiverId) : null;
  
      if (!senderObjectId || !receiverObjectId) {
        return res.status(400).json({ error: 'Invalid senderId or receiverId' });
      }
  
      // Create new message
      const newMessage = new Chat({
        sender: senderObjectId,
        receiver: receiverObjectId,
        message,
        createdAt,
        senderType,
      });
  
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Error sending message' });
    }
  };
  
//   export const getStudentDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//       try {
//         console.log('fsdsfsdfsd')
//           const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
//           const limit = parseInt(req.query.limit as string) || 6; // Default to 6 students per page
//           const skip = (page - 1) * limit; // Calculate how many records to skip
  
//           // Fetch students with pagination
//           const students = await Student.find().select("_id username")
//               .skip(skip) // Skip records
//               .limit(limit) // Limit the number of results
//               .exec(); // Execute the query
  
//           // Fetch total number of students for additional pagination info (optional)
//           const totalStudents = await Student.countDocuments();
//            console.log('st',students)
//           res.status(200).json({
//               students, // List of students for the current page
//               currentPage: page,
//               totalPages: Math.ceil(totalStudents / limit), // Total pages based on limit
//               hasMore: page * limit < totalStudents // Boolean to indicate if more students are available
//           });
//       } catch (error) {
//           next(error); // Pass error to error handler middleware
//       }
//   };

export const getStudentDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tutorId = new mongoose.Types.ObjectId(req.userId);
        console.log('Fetching student details...');
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const skip = (page - 1) * limit;

        // Aggregation to fetch students sorted by their latest chat message
        const studentsWithChats = await Student.aggregate([
            {
                $lookup: {
                    from: 'chats',
                    let: { studentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { 
                                            $and: [
                                                { $eq: ['$receiver', '$$studentId'] },
                                                { $eq: ['$sender', tutorId] }
                                            ] 
                                        },
                                        { 
                                            $and: [
                                                { $eq: ['$sender', '$$studentId'] },
                                                { $eq: ['$receiver', tutorId] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } }, // Sort by most recent message
                        { $limit: 1 } // Only take the latest message
                    ],
                    as: 'latestChat'
                }
            },
            {
                $unwind: { 
                    path: '$latestChat', 
                    preserveNullAndEmptyArrays: true // Keep students even if no chat
                }
            },
            {
                $addFields: {
                    latestMessage: {
                        $cond: {
                            if: { $gt: ['$latestChat', null] },
                            then: '$latestChat.message',
                            else: 'No messages yet'
                        }
                    },
                    createdAt: {
                        $cond: {
                            if: { $gt: ['$latestChat', null] },
                            then: '$latestChat.createdAt', 
                            else: new Date(0)
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }, // Sort by latest message date
            { $skip: skip }, // Pagination
            { $limit: limit }, // Limit results
            { $project: { _id: 1, username: 1, latestMessage: 1, createdAt: 1 } } // Select relevant fields
        ]);

        // Fetch total number of students for pagination
        const totalStudents = await Student.countDocuments();

        // Respond with formatted student details
        res.status(200).json({
            students: studentsWithChats,
            currentPage: page,
            totalPages: Math.ceil(totalStudents / limit),
            hasMore: page * limit < totalStudents 
        });
    } catch (error) {
        next(error); // Pass the error to error-handling middleware
    }
};


  
  export const getStudentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentIdParam = req.query.studentId as string;
        const tutorId = req.userId as string;

        console.log('Received studentId:', studentIdParam);
        console.log('Received tutorId:', tutorId);

        if (!studentIdParam || !tutorId) {
            res.status(400).json({ message: 'Student ID and Tutor ID are required' });
            return;
        }

        // Convert IDs to ObjectId
        const studentId = new mongoose.Types.ObjectId(studentIdParam);
        const tutorIdObj = new mongoose.Types.ObjectId(tutorId);

        console.log('Converted studentId:', studentId);
        console.log('Converted tutorIdObj:', tutorIdObj);

        // Fetch chat messages between student and tutor
        const chats = await Chat.find({
            $or: [
                { sender: studentId, receiver: tutorIdObj },
                { sender: tutorIdObj, receiver: studentId }
            ]
        }).sort({ createdAt: 1 });

        console.log('Chats found:', chats);

        res.status(200).json({ chats });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getOldChatsInStudent=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const TutorID=req.query.tutorId as string
    const StudentId=req.userId
    const {  limit, skip } = req.query;
    const TutorId=TutorID as string
    console.log('tut',TutorId)
    console.log('useriD',StudentId)
    const studentId = new mongoose.Types.ObjectId(StudentId);
    const tutorId = new mongoose.Types.ObjectId(TutorId);
 
    const chats = await Chat.find({
        $or: [
            { sender: studentId, receiver: tutorId },
            { sender: tutorId, receiver: studentId }
        ]
    }).sort({ createdAt: -1 }) // Sort by newest first
    .skip(Number(skip))
    .limit(Number(limit));;

    console.log('Chats found:', chats);

    res.status(200).json({ chats });
}

export const postTutorMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { senderId, receiverId, message, createdAt, senderType } = req.body;
      console.log('sem',senderId)
      // Debugging: Log the request body to ensure all fields are present
    //   console.log('Message data:', req.body);
      
      const newMessage = new Chat({ sender: senderId, receiver: receiverId, message, createdAt, senderType });
      console.log('TturoMesage',newMessage)
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);  // Log the error on the server
      res.status(500).json({ error: 'Error sending message' });
    }
  };