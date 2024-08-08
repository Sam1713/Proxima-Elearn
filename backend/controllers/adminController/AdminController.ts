import { NextFunction, Request, Response } from "express";
import { emailValidator, passwordValidator, userNameValidator } from "../../utils/validator";
import { AdminSignupType } from "../../types/authTypes";
import Admin from "../../models/AdminModel";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import TutorModel from "../../models/tutorModal";
import nodemailer from "nodemailer";
import Student from "../../models/studentModel";

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
        const token = jwt.sign({ id: admin._id }, process.env.ADMIN_JWT_KEY as string, {
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

    // Check if tutor exists
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
  try{
     const users=await Student.find().lean()
     console.log('usrs',users)
     return res.json(users)
  }catch(error){
    console.log(error)
  }
}