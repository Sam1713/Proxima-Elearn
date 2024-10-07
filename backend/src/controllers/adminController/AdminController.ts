import { NextFunction, Request, Response } from "express";
import { emailValidator, passwordValidator, userNameValidator } from "../../utils/validator";
import { AdminSignupType } from "../../types/authTypes";
import Admin from "../../../src/models/AdminModel";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import TutorModel from "../../../src/models/tutorModal";
import nodemailer from "nodemailer";
import Student from "../../models/studentModel";
import CategoryeModel from "../../models/categoryModel";
import CourseModel from "../../models/courseModel"; 
import mongoose from "mongoose";
import Enrollment from "../../models/enrollementModel";
import Payment from "../../models/paymentModel";

export const AdminSignup = async (req: Request<{},{},AdminSignupType>, res: Response): Promise<unknown> => {
  console.log('Request Body:', req.body);
  const { username, email, password } = req.body;
  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    res.status(404).json({ message: "Already registered email" });
  }
  if (username && !userNameValidator(username)) {
    return res.status(400).json({ error: "Invalid Username" });
  }  

  if (email && !emailValidator(email)) {
    return res.status(400).json({ error: "Invalid Email" });
  }

  if (password && !passwordValidator(password)) {
    return res.status(400).json({ error: "Invalid Password" });
  }
console.log('user ,email,pass',username,email,password)
  try {
    

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new Admin({ username, email, password: hashedPassword });
    await newUser.save();

   console.log('newUser',newUser)
   
    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const AdminSignin = async (req: Request, res: Response): Promise<unknown> => {
    const { email, password } = req.body;
 console.log('ema',email)
    try {
        const admin= await Admin.findOne({ email }).lean();
        console.log('admin',admin)
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = bcryptjs.compareSync(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
console.log('sdfdsf')
        const token = jwt.sign({ id: admin._id,userType:'admin' }, process.env.STUDENT_JWT_SECRET as string, {
        });
     console.log('tok',token)
     const { password: hashedPassword, ...rest } = admin;
     console.log('rest',rest)

        res.status(200).json({rest, token, message: "Signin successful" });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}; 

export const GetAllTutors = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const tutors = await TutorModel.find().lean();
    
    if (!tutors.length) {
      return res.status(404).json({ message: 'Tutors not found' });
    }

    const sanitizedTutors = tutors.map(({ password, bio, countrycode, files, ...rest }) => rest);

    return res.status(200).json(sanitizedTutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const GetTutorDetail=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
    const tutorId=req.params.id
  try{
   const tutor=await TutorModel.findById(tutorId).lean()
   console.log('tutor',tutor)
    const { password, countrycode, ...rest } = tutor as { password?: string; countrycode?: string; [key: string]: any };
   console.log('rest',rest)
   return res.json(rest)
  }catch(error){
    console.log(error)
  }

}




export const AdminApproveTutor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tutorId = req.params.id;
    
    console.log('Tutor ID:', tutorId);
    
    const tutor = await TutorModel.findById(tutorId);

    if (!tutor) {
      res.status(404).json({ message: 'Tutor not found' });
      return;
    }

    tutor.isApproved = true;

    await tutor.save();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: tutor.email,
      subject: 'Tutor Approval Notification',
      text: `Dear ${tutor.tutorname},\n\nYour application has been approved.\n\nBest regards,\nAdmin`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Tutor approved successfully and notification sent', isApproved:tutor.isApproved });
    
  } catch (error) {
    console.error('Error approving tutor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const AdminRejectTutor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tutorId = req.params.id;
    
    console.log('Tutor ID:', tutorId);
    
    const tutor = await TutorModel.findById(tutorId);

    if (!tutor) {
      res.status(404).json({ message: 'Tutor not found' });
      return;
    }

    tutor.isApproved = false;

    await tutor.save();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: tutor.email,
      subject: 'Tutor Approval Notification',
      text: `Dear ${tutor.tutorname},\n\nYour application has been Rejected.\n\nBest regards,\nAdmin`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Tutor Rejection successfully and notification sent', isApproved:tutor.isApproved });
    
  } catch (error) {
    console.error('Error approving tutor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const AdminUserListing=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
  console.log('hello')
  // const page=parseInt(req.query.page as string)||1
  // const limit=parseInt(req.query.limit as string)||10
  // const skip=(page-1)*limit
  // const totalDoc=await Student.countDocuments()


  try{
    const users = await Student.find().lean()
         console.log('usrs',users)
     return res.json({users})
  }catch(error){
    console.log(error)
  }
}

export const AdminBlockOrUnblock=async(req:Request,res:Response):Promise<void>=>{
  const userId=req.params.id
  console.log('urder',userId)

  const user=await Student.findById(userId)
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  console.log('blocked',user)
  user.isBlocked=!user?.isBlocked
  await user.save()
  console.log('user',user)
  if(user.isBlocked){
    res.json({message:"Sorry your Account has been blocked",user})
  }else{
    res.json({message:"Congrats,Your Block status changed",user})

  }
}

export const addCategory=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
  console.log('cate',req.body)
  const {categoryName,catDescription}=req.body
  if (!categoryName || !catDescription) {
    res.status(400).json({ message: 'Category Name and Description are required.' });
    return;
  }

  const newCategory = new CategoryeModel({
    categoryName,
    catDescription,
  });

  await newCategory.save()
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
  


}


export const getAllCategories=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  const page=parseInt(req.query.page as string)
  const limit=parseInt(req.query.limit as string)
  const skip=(page-1)*limit
  const totalCategory=await CategoryeModel.countDocuments()
  const totalPage=Math.ceil(totalCategory/limit)
  console.log('hello')
try{
  const getAllCategory=await CategoryeModel.find({isDelete:false}).skip(skip).limit(limit)

  console.log('adad',getAllCategory)
  if(!getAllCategory){
    res.status(404).json('Categories not found')
  }
  res.json({getAllCategory,totalPage})
}catch(error){
  res.json(error)
}
}


export const deleteCategory=async(req:Request,res:Response):Promise<void>=>{
  const id=req.params.id
  console.log('id',id) 
  const catId=new mongoose.Types.ObjectId(id)
  console.log('ca',catId)
  const category = await CategoryeModel.findByIdAndUpdate(
    catId,
    { $set: { isDelete: true } },
    { new: true } 
  );
  if(!category){
    res.json("Category nor found")
  }
  
  console.log('ca',category)
  res.json('category deleted succcesfully')
}

export const updateCategory=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
  const id=req.params.id
  console.log('id',id)
  console.log('req',req.body)
  const { categoryName, catDescription } = req.body;

  if (!categoryName || !catDescription) {
    res.status(400).json({ message: 'Both categoryName and catDescription are required' });
    return;
  }
  const updatedCategory = await CategoryeModel.findByIdAndUpdate(
    id,
    {
      $set: {
        categoryName,
        catDescription
      }
    },
    { new: true } 
  );
  if (!updatedCategory) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });

  }catch(error){
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const getTutorCourses=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('sdfsdf')
  try{
    console.log('s')
    const TutorId=req.params.id
    const tutorId=new mongoose.Types.ObjectId(TutorId)
    console.log('tt',TutorId)
  const tutorCourses=await CourseModel.find({tutorId})
  console.log('tut',tutorCourses)
  if(!tutorCourses){
    res.json('No Course Found')
  }
  res.json(tutorCourses)
  }catch(error){ 
    console.log('err',error)
  }
}

export const getTutorCourseDetails = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    console.log('id',req.params.id)
    let CourseId = req.params.id

    console.log('cor',CourseId);
    // const courseId=new mongoose.Types.ObjectId(CourseId)

    // if (!mongoose.Types.ObjectId.isValid(courseId)) {
    //   return res.status(400).json({ message: 'Invalid Course ID' });
    // }
    const course = await CourseModel.findById(CourseId); 
    console.log('course', course);

    if (!course) {
      return res.status(404).json('Course details not found');
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course details:', error);
    next(error); 
  }
};

export const adminSignout=async(req:Request,res:Response)=>{
  res.clearCookie('access_token').status(200).json({message:"Signout successful"})
}



export const getOrdersList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Fetching orders list...');
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 4;
    const skip=(page-1)*limit
    const totalOrders=await Payment.countDocuments()


    const ordersList = await Payment.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'EnrollmentDetails'
        }
      },
      {
        $unwind: { path: "$EnrollmentDetails" }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'EnrollmentDetails.studentId',
          foreignField: '_id',
          as: 'StudentDetails'
        }
      },
      {
        $unwind: { path: "$StudentDetails" }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'EnrollmentDetails.courseId',
          foreignField: '_id',
          as: 'CourseDetails'
        }
      },
      {
        $unwind: { path: "$CourseDetails" }
      },
      {
        $project: {
          _id: 0,
          username: '$StudentDetails.username',
          email: '$StudentDetails.email',
          profilePic: '$StudentDetails.profilePic',
          title: '$CourseDetails.title',
          price: '$CourseDetails.price',
            createdAt: '$created_at'
        }
      },
      {
        $sort:{
          createdAt:-1
        }
      },
      {
        $skip:skip
      },
      {
        $limit:limit
      },
     
    ]);
    const totalPages = Math.ceil(totalOrders / limit);
    console.log('tit',totalPages)

    console.log('Orders list:', ordersList);
    res.status(200).json({ordersList,totalPages});
  } catch (error) {
    console.error('Error fetching orders list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAdminWalletDetails=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
  const id=req.userId
  console.log('id',id)
  const walletDetails=await Payment.aggregate([
    {
      $group:{
        _id:null,
        totalAmount:{$sum:'$amount'}
      }
    }
  ])
  console.log('wallet',walletDetails[0].totalAmount)
  const totalAmount=walletDetails[0].totalAmount
  const adminAmount=walletDetails[0].totalAmount*0.3
  console.log('admin',adminAmount)
  res.json({adminAmount,totalAmount})
}catch(error){
  console.log('err',error)
}
}


export const getUserSearch=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('eewr')
  const search=req.query.search as string
  console.log('s',search) 
  try{
    const users=await Student.find(
      {
        username:{ $regex: search, $options: 'i' }
      }
    )
    if(!users){
      res.json('No users found')
    }
    res.json(users)
  }catch(error){
    console.log('er',error)
  }
} 

export const getOrderSearchVal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchVal = req.query.searchVal as string;

    const searchRegex = new RegExp(searchVal, 'i'); // 'i' makes it case-insensitive

    const ordersList = await Payment.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'EnrollmentDetails'
        }
      },
      {
        $unwind: { path: "$EnrollmentDetails" }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'EnrollmentDetails.studentId',
          foreignField: '_id',
          as: 'StudentDetails'
        }
      },
      {
        $unwind: { path: "$StudentDetails" }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'EnrollmentDetails.courseId',
          foreignField: '_id',
          as: 'CourseDetails'
        }
      },
      {
        $unwind: { path: "$CourseDetails" }
      },
      {
        $match: {
          $or: [
            { 'StudentDetails.username': searchRegex },    // Search by username
            { 'StudentDetails.email': searchRegex },       // Search by email
            { 'CourseDetails.title': searchRegex }         // Search by course title
          ]
        }
      },
      {
        $project: {
          _id: 0,
          username: '$StudentDetails.username',
          email: '$StudentDetails.email',
          profilePic: '$StudentDetails.profilePic',
          title: '$CourseDetails.title',
          price: '$CourseDetails.price',
          createdAt: '$created_at'
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: Number(req.query.skip) || 0
      },
      {
        $limit: Number(req.query.limit) || 10
      },
    ]);

    const totalOrders = await Payment.countDocuments(); // For pagination, you might want to adjust the count
    const totalPages = Math.ceil(totalOrders / (Number(req.query.limit) || 10));

    res.status(200).json({ ordersList, totalPages });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
