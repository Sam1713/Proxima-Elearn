import { Request, Response, NextFunction } from 'express';
import Tutor from '../../models/tutorModal';
import cloudinary from '../../utils/cloudinaryConfig'; 
import { TutorSigninType } from '../../types/tutorAuth';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
    console.log(validUser)
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcryptjs.compareSync(password, validUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(validUser)
    const token = jwt.sign({ id: validUser.id }, process.env.TUTOR_SECRET_KEY as string, { expiresIn: '1h' });

    const { password: _, ...rest } = validUser.toObject(); 

    res.cookie("access_token", token, { httpOnly: true, maxAge: 3600000 }) // Set cookie with expiry
       .status(200)
       .json({message:"Login successful",rest});
  } catch (error) {
    next(error); 
  }
};
