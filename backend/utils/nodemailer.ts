import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Middleware for sending an email
export const sendEmail = (to: string, subject: string, text: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to, 
        subject,
        text,
      };

      await transporter.sendMail(mailOptions);

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
