import { NextFunction, Request, Response } from 'express';
import Student from '../models/studentModel';

export const VerifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.userId;
    console.log('Verifying user:', userId);

    try {
        const user = await Student.findById(userId);
        console.log('User found:', user);

        if (user?.isBlocked) {
            console.log('sfsdf')
            res.clearCookie('access_token').status(403).json({ error: 'UserBlocked', message: 'Sorry, your account has been blocked. Please sign in again.' });
        } else {
            next();
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        next(error);
    }
};
