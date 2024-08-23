import { Request, Response, NextFunction } from 'express';
import Tutor from '../../models/tutorModal';
import cloudinary from '../../utils/cloudinaryConfig'; 
import { TutorSigninType } from '../../types/tutorAuth';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import TutorModel from '../../models/tutorModal';
import nodemailer from "nodemailer";
import { OTP } from "../../utils/randomPassword";
import { emailValidator } from '../../utils/validator';
import CourseModel from '../../models/courseModel';
import mongoose, { Types } from 'mongoose';



export const tutorSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    let fileUrls: string[] = [];

    if (files) { 
      const fileUploads = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.url; 
      });

      fileUrls = await Promise.all(fileUploads);
    }

    const { tutorname, email, countrycode, phonenumber, password, bio } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newTutor = new Tutor({
      tutorname,
      email,
      countrycode,
      phonenumber,
      password: hashedPassword,
      bio,
      files: fileUrls, 
    });

    console.log('New Tutor:', newTutor);

    await newTutor.save();

    res.status(201).json({ message: 'Tutor signed up successfully', tutor: newTutor });
  } catch (error) {
    next(error); 
  }
};

export const tutorSignin = async (req: Request<{}, {}, TutorSigninType>, res: Response, next: NextFunction): Promise<unknown> => {
  try {

    const { email, password } = req.body;

    const validUser = await Tutor.findOne({ email });
    if(!validUser?.isApproved){
      return res.json('Your account is underProcessing')
    }
    console.log(validUser)
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    } 

    const isPasswordValid = bcryptjs.compareSync(password, validUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(validUser)
    const token = jwt.sign({ id: validUser.id }, process.env.TUTOR_SECRET_KEY as string);
console.log('tok',token)
    const { password: _, ...rest } = validUser.toObject(); 

    res.json({rest, token, message: "Signin successful" });
  } catch (error) {
    next(error); 
  }
};

export const TutorWait=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
  const userId=req.userId
  console.log('userid',userId)
  const tutor=await TutorModel.findById(userId)
  let tutorApproval=tutor?.isApproved
  console.log(tutorApproval)
  return res.json(tutorApproval)
}


export const getTutorHome=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
  return res.json("homepage successfully rendered")
}
let OTPnew:string=''
export const sendOtpTutor=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{

  const {email}=req.body
  console.log('email',email)
  if(!email||!emailValidator(email)){
    res.json('Check email once again')
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const randomOtp=OTP(6) 
OTPnew=randomOtp
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Use this otp to reset your password: ${randomOtp}. The token is valid for 10 minutes.`,
  };
  console.log('rans',randomOtp)

  await transporter.sendMail(mailOptions);

  return res.json({
    message: "Otp sent successfully",
    data: { randomOtp }
});
 
}


export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const  getOtp  = req.body;

  console.log('Received OTP:', getOtp.otp);
  console.log('Stored OTP:', OTPnew);

  if (getOtp.otp === OTPnew) {
    // OTP is verified successfully
    OTPnew = ''; // Clear OTP after successful verification
    return res.json({ message: 'Verified successfully' });
  } else { 
    // OTP verification failed
    return res.status(400).json({ message: 'Verification failed' });
  }
};
interface UpdateDetailsTutor{
  tutorname?:string
  email?:string
  phonenumber?:string
}
export const updateTutor=async(req:Request<{},{},UpdateDetailsTutor>,res:Response,next:NextFunction):Promise<void>=>{
  try{
  console.log('re',req.body)
  const tutorId=req.userId
  console.log('ttut',tutorId)
  const {tutorname,email,phonenumber}=req.body
  console.log('name',tutorname)
  console.log('ema',email)
  console.log('num',phonenumber)
  const tutor=await TutorModel.findById(tutorId)
  const updateData: any = {};

        if (tutorname) {
            updateData.tutorname = tutorname;
        }
        if (email) {
            updateData.email = email;
        }
        if (phonenumber) {
            updateData.phonenumber = phonenumber;
        }

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: 'No fields to update' });
            return;
        }
        const updatedTutor = await TutorModel.findOneAndUpdate(
          { _id: tutorId },  // Match the document by ID
          { $set: updateData },  // Set the fields to update
          { new: true }  // Return the updated document
      ).select('-password');
      
    console.log('up',updatedTutor)
    res.status(200).json({data:updatedTutor, message: 'Tutor updated successfully' });
    } catch (error) {
        console.error('Error updating tutor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  } 
  
interface BioType{
  bio:string
}
export const updateBio = async (req: Request<{}, {}, BioType>, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('req.body:', req.body);
    const { bio } = req.body;
    const tutorId = req.userId; // Ensure req.userId is set properly (e.g., via authentication middleware)

    if (!bio || !tutorId) {
      res.status(400).json({ error: 'Bio and tutor ID are required' });
      return;
    }

    // Update the tutor's bio
    const updateTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: { bio } },
      { new: true } // Return the updated document
    ).lean();

    if (!updateTutor) {
      res.status(404).json({ error: 'Tutor not found' });
      return;
    }

    // Omit sensitive fields if needed
    const { password, ...rest } = updateTutor;
    console.log('ip',rest)
    
    res.status(200).json(rest); // Send the updated tutor data back to the client

  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

interface fileType{
  files:string[]|null
}
export const updateFiles=async(req:Request<{},{},fileType>,res:Response,next:NextFunction):Promise<any>=>{
  try{
    const tutorId=req.userId
    const files = req.files as Express.Multer.File[] | undefined;
    if(!files || files.length==0 || files.length>10){
      return res.json('Please check your files')
    }
    let fileUrls: string[] = [];

    if (files) { 
      const fileUploads = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.url; 
      });

      fileUrls = await Promise.all(fileUploads);
    }

  const tutor=await TutorModel.findByIdAndUpdate(
    tutorId,
      { $push: { files: { $each: fileUrls } } },
      { new: true } // Option to return the updated document
    ).lean();
   console.log('updat',tutor)
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found.' });
    }
    const {password,...rest}=tutor;
    res.json({message:'Successfully added files',rest})

}catch(error){
  console.log(error)
}

}

export const tutorSignout=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('dada')
    res.clearCookie('access_token').status(200).json({message:"Signout successful"})
}


export const acceptLicense=async(req:Request,res:Response,next:NextFunction):Promise<unknown>=>{
  console.log('req')
  const tutorId=req.userId
  if (!tutorId) {
    res.status(400).json({ message: 'Tutor ID is missing from request' });
    return;
}
  const tutor=await TutorModel.findByIdAndUpdate(
    tutorId,
    {license:true},
    {new:true}
  ).lean()
  console.log('tut',tutor)
  if (!tutor) {
    res.status(404).json({ message: 'Tutor not found' });
    return;
}
const {password,...rest}=tutor
res.json({message:"Aggrement accepted successfully",rest})
} 


