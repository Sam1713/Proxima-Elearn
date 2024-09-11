import { Request, Response, NextFunction } from 'express';
import CourseModel from '../../models/courseModel';
import Student from '../../models/studentModel';
import Enrollment from '../../models/enrollementModel';
import { createRazorpayOrder, IRazorder, verifyRazorpayPayment } from '../../utils/razorpay';
import Payment from '../../models/paymentModel';
import mongoose, { Mongoose } from 'mongoose';
import TutorModel from '../../models/tutorModal';
import Quiz from '../../models/quizModel';

export const createCheckout = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const userId = req.userId;
        const { courseId } = req.body as any;

        console.log('user', userId);
        console.log('course', courseId);

        const course = await CourseModel.findOne(
            { _id: courseId },
            { _id: 0, price: 1, title: 1 }
        );

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        console.log('co', course.price);
        const courseTitle = course.title;
        const amount = course.price;

        console.log('title', courseTitle);

        const student = await Student.findOne(
            { _id: userId },
            { _id: 0, username: 1, email: 1 }
        );

        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        console.log('stude', student);

        const enrollment = await Enrollment.findOneAndUpdate(
            {
                courseId: courseId,
                studentId: userId,
            },
            {
                courseId: courseId,
                studentId: userId,
                payment_status: "pending",
            },
            {
                new: true,
                upsert: true, 
            }
        );

        console.log('enrol', enrollment);

        const Razorder = await createRazorpayOrder(
            enrollment._id as unknown as string,
            amount as number
          )
            .then((order) => order)
            .catch((err) => {
              if (err) {
                res.status(500);
                next(Error("Error occured in razorpay"));
              }
            });
            const timestamp = (Razorder as IRazorder).created_at;
            const date = new Date(timestamp * 1000);
            const formattedDate = date.toISOString();

            
            
            await Payment.findOneAndUpdate(
              {
                enrollmentId: enrollment._id,
              },
              {
                paymentId: (Razorder as IRazorder).id,
                amount: (Razorder as IRazorder).amount / 100,
                currency: (Razorder as IRazorder).currency,
                enrollmentId: enrollment._id,
                status: (Razorder as IRazorder).status,
                created_at: formattedDate,
              },
              {
                upsert: true,
              }
            );
        
            res.status(200).json({
              success: true,
              order: Razorder,
              student,
              title:courseTitle, 

            });

}catch(error){
    console.log(error)
}
}


export const verifyPayment=async(req:Request,res:Response)=>{
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =req.body;
    console.log('sfsdf')
    console.log('id',razorpay_payment_id)
    console.log('order',razorpay_order_id)
    console.log('sign',razorpay_signature)
    const isVerified = verifyRazorpayPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

    if (isVerified) {
        const payment = await Payment.findOne(
          { paymentId: razorpay_order_id },
          { _id: 0, enrollmentId: 1 }
        );
     console.log('pa',payment)

        if (payment) {
          const enrollmentId = payment.enrollmentId;
  
          await Enrollment.findOneAndUpdate(
            { _id: enrollmentId },
            { payment_status: "completed" }
          );
  
          res.json({
            success: true,
            message: "payment verified successfull",
          });
        }
      } else {
        res.status(500);
        console.log(Error("Internal Server Error"));
      }
    }
  
    export const OrderedCourses = async (req: Request, res: Response, next: NextFunction) => {
      try{
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is missing' });
            }
    
            const studentId = new mongoose.Types.ObjectId(userId);
    
            console.log('User ID:', userId);
            console.log('Student ID:', studentId);
    
            const enrolledCourses = await Enrollment.aggregate([
                { $match: { payment_status: 'completed', studentId: studentId } },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'Courses',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'tutors',
                                    localField: 'tutorId',
                                    foreignField: '_id',
                                    as: 'Tutors'
                                }
                            },
                            { $unwind:{path:'$Tutors'}},

                        ]

                    }
                },
                { $unwind: { path: '$Courses', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                      'Courses._id':1,
                        'Courses.title': 1,
                        'Courses.description': 1,
                        'Courses.coverImageUrl': 1,
                        'Courses.Tutors.tutorname':1
                    },
                    
                
                }
            ]);
    
            console.log('Enrolled Courses:', enrolledCourses);
            res.json({ success: true,  enrolledCourses });
          }catch(error){
            res.json('Sorry course cant be found')
          }
        }    


        export const getOrderedCourseDetail=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
          console.log('sfdfsds')
          const CourseId=req.params.id
          const courseId=new mongoose.Types.ObjectId(CourseId)
          const UserId=req.userId
          const userId=new mongoose.Types.ObjectId(UserId)

          console.log('course',courseId)
          const enrolledCourseDetail=await Enrollment.aggregate([
            {
              $match:{courseId:courseId,studentId:userId,payment_status:'completed'}
            },
            {
              $lookup:{
                from:'courses',
                localField:'courseId',
                foreignField:'_id',
                as:'Courses'
              }
            },
            {
              $unwind:{path:'$Courses'}
            },
              {
                $lookup: {
                    from: 'tutors',
                    localField: 'Courses.tutorId',
                    foreignField: '_id',
                    as: 'Tutors'
                }
            },
            {
                $unwind: { path: '$Tutors' }
            },
            {
              $addFields: {
                  'Courses.tutorDetails': {
                      tutorId:'$Tutors._id',
                      tutorname: '$Tutors.tutorname',
                      email: '$Tutors.email',
                      phonenumber: '$Tutors.phonenumber',
                      bio: '$Tutors.bio'
                  }
              }
          },
            {      
              $project:{
                'Courses.title':1,
                'Courses.description':1,
                'Courses.category':1,
                'Courses.AboutCourse':1,
                "Courses.lessons":1,
                "Courses.coverImageUrl":1,
                'Courses.videos': 1,
                'Courses.tutorDetails': 1
              }
            },  
            { $limit: 1 }
          ]) 
          const courseDetail = enrolledCourseDetail.length > 0 ? enrolledCourseDetail[0] : {};

          console.log('enrolled',courseDetail)
          const TutorId= courseDetail?.Courses?.tutorDetails?.tutorId
         console.log('isfds',TutorId)
          const otherCourses=await CourseModel.find({
            tutorId:TutorId,
             _id:{$ne:courseId },

          })
          const quizzes = await Quiz.findOne({ courseId: courseId });
          // if(!quizzes){
          //   res.json(null)
          // }
           const formattedQuiz = quizzes ? {
            _id: quizzes._id,
            courseId: quizzes.courseId,
            questions: quizzes.questions
          } : null;
      
      
         
        console.log('quiz',quizzes)

          // console.log('Other courses by the tutor:', otherCourses);

          res.json({
        courseDetail,
        otherCourses,
        quizzes:formattedQuiz
          });        }

export const getPaymentDetails=async(req:Request,res:Response)=>{
  const StudentId=req.userId
  const studentId=new mongoose.Types.ObjectId(StudentId)
  console.log('srug',studentId)

  const paymentDetails=await Enrollment.aggregate([
    {
      $match:
      {studentId:studentId,payment_status:'completed'}
    },
  {
        $lookup:{
            from:'payments',
            localField:'_id',
            foreignField:'enrollmentId',
            as:'PaymentDetails'
    }
  },
  {
    $unwind: '$PaymentDetails' 
  },
  {
    $lookup: {
      from: 'courses', 
      localField: 'courseId', 
      foreignField: '_id', 
      as: 'PurchasedCourses'
    }
  },
  {
    $unwind: '$PurchasedCourses' 

  },
  {
    $addFields:{
      'PaymentDetails':{
        title:'$PurchasedCourses.title',
        description:'$PurchasedCourses.description',
        coverImage:'$PurchasedCourses.coverImageUrl'
      }
    }
  },

  
 
  {
    $project: {
      _id: 0, 
      studentId: 1,
      'PaymentDetails._id': 1, // Include Payment _id
          'PaymentDetails.title': 1, // Include the course title
          'PaymentDetails.description': 1, // Include course description
          'PaymentDetails.coverImage': 1, // Include course cover image
          'PaymentDetails.amount': 1, // Include the payment amount
          'PaymentDetails.currency': 1, // Include the payment currency
          'PaymentDetails.status': 1, // Include the payment status
          'PaymentDetails.paymentId': 1, // Include the paymentId
          'PaymentDetails.created_at': 1
    }
  },
   {
        $sort: {
          'PaymentDetails.created_at': -1 // Sort by the created_at field in descending order
        }
      },
]);

console.log('Payment Details:', paymentDetails);
  res.json({data:paymentDetails})

}