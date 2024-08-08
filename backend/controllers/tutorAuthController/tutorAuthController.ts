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
  
