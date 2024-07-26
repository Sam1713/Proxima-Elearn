import { Request, Response, NextFunction } from "express";
import Student from "../../models/studentModel";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error";
import {
  userNameValidator,
  emailValidator,
  passwordValidator,
  validateConfirmPassword,
} from "../../utils/validator";
import { SigninType, StudentDetails } from "../../types/authTypes";
import jwt from "jsonwebtoken";
export const auth = async (
  req: Request<{}, {}, StudentDetails>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!userNameValidator(username)) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }
    if (!emailValidator(email)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }
    if (!passwordValidator(password)) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }
    if (!validateConfirmPassword(confirmPassword, password)) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new Student({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Student profile created successfully" });
  } catch (error) {
    next(errorHandler);
  }
};

export const authSignin = async (
  req: Request<{}, {}, SigninType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await Student.findOne({ email }).lean();
    if (!user) return next(errorHandler(404, "User not found"));
    const validPassoword = bcryptjs.compareSync(password, user.password);
    if (!validPassoword) return next(errorHandler(402, "Wrong credentials"));
    const token = jwt.sign(
      { id: user.id },
      process.env.STUDENT_JWT_SECRET as string
    );
    const {password:hashedPassword,...rest}=user
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(errorHandler);
  }
};
