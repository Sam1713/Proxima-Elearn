import { Request, Response } from "express";
import Student from "../../models/studentModel";
import bcryptjs from 'bcryptjs'

interface StudentDetails {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export const auth = async (
  req: Request<{}, {}, StudentDetails>,
  res: Response
): Promise<void> => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.json("Check your credential");
    return;
  }
  const hashedPassword=bcryptjs.hashSync(password,10)
  try {
    const newUser = new Student({ username, email, password:hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Student profile created successfully" });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }  }
};
