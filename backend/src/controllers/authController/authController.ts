import { Request, Response, NextFunction } from "express";
import Student from "../../models/studentModel";
import bcryptjs from "bcryptjs";
import { createError } from "../../utils/error";
import {
  userNameValidator,
  emailValidator,
  passwordValidator,
  validateConfirmPassword,
} from "../../utils/validator";
import { 
  SigninType, 
  StudentDetails,
  ForgotPasswordType,
} from "../../types/authTypes";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../../utils/cloudinaryConfig";
import { OTP } from "../../utils/randomPassword";
import CourseModel from "../../models/courseModel";
import mongoose from "mongoose";
import Notification from "../../models/notificationModel";
import CategoryeModel from "../../models/categoryModel";

export const auth = async (
  req: Request<{}, {}, StudentDetails>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!userNameValidator(username)) {
      throw createError(400, "Invalid username");
    }
    if (!emailValidator(email)) {
      res.status(400).json({ message: "Invalid email" });
    }
    if (!passwordValidator(password)) {
      res.status(400).json({ message: "invalid password" });
    }
    if (!validateConfirmPassword(confirmPassword, password)) {
      res.status(400).json({ message: "password not matching" });
    }

    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      res.status(404).json({ message: "Email can't be recognized" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new Student({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Student profile created successfully" });
  } catch (error) {
    next(error);
  }
};

export const authForgotPassword = async (
  req: Request<{}, {}, ForgotPasswordType>,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.STUDENT_JWT_SECRET as string,
      { expiresIn: "10m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `You requested for a password reset. Use this token to reset your password: ${token}. The token is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset email sent successfully.", token });
  } catch (error) {
    next(error);
  }
};

export const authSignin = async (
  req: Request<{}, {}, SigninType>,
  res: Response,
  next: NextFunction
): Promise<unknown> => { 
  const { email, password } = req.body;
  try {
    const user = await Student.findOne({ email }).lean(); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    const token = jwt.sign(
      { id: user._id,userType:'student' }, 
      process.env.STUDENT_JWT_SECRET as string,
    );
    console.log('Generated token:', token); 

    const { password: hashedPassword, ...rest } = user;

    res.status(200).json({token,rest, message: "Sign-in successful" });
  } catch (error) {
    next(error);
  }

};

export const authResetPassword = async (
  req: Request<{}, {}, { token: string; password: string }>,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const { token, password } = req.body;

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.STUDENT_JWT_SECRET as string
    );
    const user = await Student.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!passwordValidator(password)) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    user.password = await bcryptjs.hash(password, 12);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(createError(500, "Invalid or expired token"));
  }
};


export const authWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const { username, email, photo: profilePic } = req.body;
  console.log(req.body)

  // Trim the username to remove any leading or trailing spaces
  const trimmedUsername = username ? username.trim() : '';

  try {
    const user = await Student.findOne({ email }).lean();

    if (user) {
      const token = jwt.sign(
        { id: user._id,userType:'student' }, 
        process.env.STUDENT_JWT_SECRET as string
      );
      console.log('toke',token)

      const { password: hashedPassword, ...rest } = user;
      res.status(200).json({token,message: "Sign-in successful" });
    } else {
      const genPass = Math.random().toString(36).substring(2); 
      const hashedPassword = bcryptjs.hashSync(genPass, 10);

      if (!trimmedUsername) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const newUser = new Student({
        username: trimmedUsername,
        email,
        password: hashedPassword,
        profilePic,
      });

      await newUser.save(); 

      const token = jwt.sign(
        { id: newUser._id,userType:'student' }, 
        process.env.STUDENT_JWT_SECRET as string
      );

      return res
  .cookie('access_token', token, { httpOnly: true })
  .status(200)
  .json({ token })
    }
  } catch (error) {
    next(error);
  }
};


export const authSignOut=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
       res.clearCookie('access_token').status(200).json({message:"Signout successful"})
}


export const updateDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
   console.log('user',userId)
    const { username, email } = req.body;
    if (username && !userNameValidator(username)) {
      return res.status(400).json({ message: "Username is not valid" });
    }
    if (email && !emailValidator(email)) {
      return res.status(400).json({ message: "email is not valid" });
    }
    console.log('sfds')

    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.username = username || student.username;
    student.email = email || student.email;
 
    // Handle file upload
    // if (req.file) {
    //   student.profilePic = req.file.path; // Save file path in the DB

    // }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      student.profilePic = result.url; 
    }
    await student.save();

    res.status(200).json({ message: 'Student details updated successfully', student });
  } catch (error) {
    next(error);  
    
  }
};


export const updatePasswordinStudentProfile = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    console.log('Request body:', req.body);
    
    const userId = req.userId; 
    console.log('User ID:', userId);
    
    const { currentPassword, newPassword } = req.body;
   

   console.log('sdada')
    const user = await Student.findById(userId);
    console.log('user',user)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    console.log('match',isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    if (!passwordValidator(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long and include letters, numbers, and special characters.' });
    }
    console.log('user',user)

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const forgotPasswordInStudentProfile=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
  console.log('req.bod',req.body)
  const {email}=req.body

  const user = await Student.findOne({ email });
  

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
   user.otp=''

    await user.save()

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const randomOtp=OTP(6)
  user.otp=randomOtp
  await user.save()
  console.log('random',randomOtp)
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Use this otp to reset your password: ${randomOtp}. The token is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);


  res
  .status(200)
  .json({ message: "Password reset email sent successfully."});
}


  export const verifyOtpAndResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    console.log(req.body);
  
    const { otp,newPassword, confirmPassword } = req.body;
    
    try {
      console.log('OTP:', otp);
  
      const user = await Student.findOne({ otp });
      console.log('Found user:', user);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found or invalid OTP' });
      }
  
      if (confirmPassword !== newPassword) {
        return res.status(400).json({ error: 'Password mismatch' });
      }
  
      const hashNewPass = bcryptjs.hashSync(newPassword, 10);
      console.log('Hashed new password:', hashNewPass);
  
      user.password = hashNewPass;
      user.otp = undefined; 
  
      const savedUser = await user.save();
      console.log('Saved user:', savedUser);
  
      return res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ error: 'An error occurred while resetting the password.' });
    }
  };

  export const GetAllCourses=async(req:Request,res:Response):Promise<unknown>=>{
    console.log('reached...') 
    const page: number = parseInt(req.query.page as string) || 1;  
    const limit: number = parseInt(req.query.limit as string) || 10; 

    const skip: number = (page - 1) * limit;

    if (isNaN(skip) || skip < 0) {
      return res.status(400).json({ message: 'Invalid page or limit parameters' });
    }
    console.log('skip',skip) 
    const totalCourses=await CourseModel.countDocuments({isDelete:false})
    console.log('das',totalCourses)
    const courses = await CourseModel.aggregate([
      {$match:{isDelete:false}},
      { 
        $lookup: {
          from: 'tutors', 
          localField: 'tutorId',
          foreignField: '_id',
          as: 'tutorDetails'
        }
      },
      {
        $unwind: {  
          path: '$tutorDetails',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: { 
          id:1,
          title: 1,
          category: 1,
          coverImageUrl: 1,
          price:1,
          description:1,
          'tutorDetails.tutorname': 1,
          'tutorDetails.bio': 1
        }
      },
      {
        $skip:skip
      },
      {
        $limit:limit
      }
    ]);
    const totalPages=Math.ceil(totalCourses/limit)
    const categories = await CategoryeModel.find({ isDelete: false }).select('categoryName');

    // console.log('Courses with tutor details:', courses);
    res.json({courses,totalPages,categories})
  }

  export const getSingleCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      console.log('Fetching course details for ID:', courseId);
      
      const [course] = await CourseModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(courseId) },
        },
        {
          $lookup: {
            from: 'tutors',
            localField: 'tutorId',
            foreignField: '_id',
            as: 'tutorDetails',
          },
        },
        {
          $unwind: {
            path: '$tutorDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            id: 1,
            title: 1,
            price: 1,
            category: 1,
            AboutCourse: 1,
            lessons: 1,
            coverImageUrl: 1,
            description: 1,
            'tutorDetails.tutorname': 1,
            'tutorDetails.bio': 1,
          },
        },
      ]);
  
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }
  
      const otherCourses = await CourseModel.find({
        _id: { $ne: courseId },
      });
  
      console.log('Course details:', course);
      console.log('Other courses by the tutor:', otherCourses);
  
      res.json({
        message: 'Course details received',
        data:
          course,
          data1:
          otherCourses,
        
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Error fetching course', error });
    }
  };


  export const getAllCategory=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
    try{
      const page: number = parseInt(req.query.page as string) || 1;  
    const limit: number = parseInt(req.query.limit as string) || 10; 

    const skip: number = (page - 1) * limit;

    if (isNaN(skip) || skip < 0) {
      return res.status(400).json({ message: 'Invalid page or limit parameters' });
    }

    console.log('Page:', page, 'Limit:', limit, 'Skip:', skip);

      const totalNumber=await CategoryeModel.countDocuments()

    console.log('yes')
    const getAllCategories=await CategoryeModel.find({isDelete:false}).skip(skip).limit(limit)
    if(!getAllCategories){
      res.json('No Course Found')
    }
    console.log('a',getAllCategories)
    const totalPages= Math.ceil(totalNumber / limit)

    console.log('tit',totalPages)
    res.json(
      {getAllCategories, 
        totalCategories: totalNumber,
        totalPages 
 }) 
  }catch(error){
    res.json('Error Occured')
  }
  }

  // export const getAllCoursesSinglePage=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  //   console.log('sfdsdfs')
  //   try{
  //   const courses=await CourseModel.find()
  //   if(!courses){
  //     res.json('No courses Found')
  //     return
  //   }
  //   res.json(courses)
  // }catch(error){
  //   console.log('err',error)
  // }
  // }

  export const getAllNotifications=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const studentId=req.userId
    // console.log('id',studentId)
    const notifications=await Notification.find({
      $or:[
        
        {studentId:studentId,read:false},
        {isGlobal:true,read:false}
      ]
    }).sort(
      {createdAt:-1}
    ) 
    // console.log('not',notifications)
    res.json(notifications)
  }

  export const deleteNotification=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    console.log('started...')
    const {id}=req.body
    console.log('id',id)
    const notId=new mongoose.Types.ObjectId(id)
    const notifications=await Notification.findById(notId)
    console.log('n',notifications)
    if(!notifications){
      res.status(404).json("Notification not found")
    }
    const updateNotification=await Notification.findByIdAndUpdate(
      notId,
        {$set:{read:true}},
        {new:true}
    )
   console.log('updateNo',updateNotification)
   res.json('Successfully deleted')
  }   


  export const getFullCourses=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    console.log('reached...') 
    const page=parseInt(req.query.page as string)
    const limit=parseInt(req.query.limit as string)
    console.log('li',limit)
    const skip=(page-1)*limit
    console.log('skip',skip) 
    const totalCourses=await CourseModel.countDocuments()
    const courses = await CourseModel.aggregate([
      {$match:{isDelete:false}},
      { 
        $lookup: {
          from: 'tutors', 
          localField: 'tutorId',
          foreignField: '_id',
          as: 'tutorDetails'
        }
      },
      {
        $unwind: {  
          path: '$tutorDetails',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: { 
          id:1,
          title: 1,
          category: 1,
          coverImageUrl: 1,
          price:1,
          description:1,
          'tutorDetails.tutorname': 1,
          'tutorDetails.bio': 1
        }
      },
      {
        $skip:skip
      },
      {
        $limit:limit
      }
    ]);
    const totalPages=Math.ceil(totalCourses/limit)

    // console.log('Courses with tutor details:', courses);
    res.json({courses,totalPages})
  }