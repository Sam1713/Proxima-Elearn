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
      { id: user._id }, // Adjust as necessary
      process.env.STUDENT_JWT_SECRET as string,
      // Optional: set token expiration
    );
    console.log('Generated token:', token); // Log token

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
      // User exists, create a JWT token
      const token = jwt.sign(
        { id: user._id }, // Assuming _id is the identifier in the Student model
        process.env.STUDENT_JWT_SECRET as string
      );
      console.log('toke',token)

      const { password: hashedPassword, ...rest } = user;
      res.status(200).json({token,message: "Sign-in successful" });
    } else {
      // User does not exist, create a new user
      const genPass = Math.random().toString(36).substring(2); // Generate a random password
      const hashedPassword = bcryptjs.hashSync(genPass, 10);

      // Validate that username is not empty
      if (!trimmedUsername) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const newUser = new Student({
        username: trimmedUsername,
        email,
        password: hashedPassword,
        profilePic,
      });

      await newUser.save(); // Save the new user to the database

      const token = jwt.sign(
        { id: newUser._id }, // Assuming _id is the identifier in the Student model
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
    // Validate input data
    const { username, email } = req.body;
    if (username && !userNameValidator(username)) {
      return res.status(400).json({ message: "Username is not valid" });
    }
    if (email && !emailValidator(email)) {
      return res.status(400).json({ message: "email is not valid" });
    }
    console.log('sfds')

    // Find the student by ID
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
      student.profilePic = result.url; // Save the Cloudinary URL in the DB
    }
    // Save the updated student
    await student.save();

    res.status(200).json({ message: 'Student details updated successfully', student });
  } catch (error) {
    next(error);  // Pass errors to the error-handling middleware
  }
};

// Adjust the path to your model

export const updatePasswordinStudentProfile = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    console.log('Request body:', req.body);
    
    // Extract user ID from request object
    const userId = req.userId;  // This assumes userId is set by the auth middleware
    console.log('User ID:', userId);
    
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await Student.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password matches
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const forgotPasswordInStudentProfile=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('req.bod',req.body)
  const {email}=req.body
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
console.log(OTP(6))
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Use this otp to reset your password: ${OTP(6)}. The token is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);


  res
  .status(200)
  .json({ message: "Password reset email sent successfully."});
}


export const verifyOtpAndResetPassword=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log(req.body)

  const {otp,newPassword,confirmPassword}=req.body

  
}