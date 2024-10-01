import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}




const authMiddleware = (userType: 'student' | 'admin' | 'tutor') => (req: Request, res: Response, next: NextFunction) => {
  console.log('usetu',userType)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('token', token);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const secret = process.env.STUDENT_JWT_SECRET as string; 
    if (!secret) {
      throw new Error('JWT secret is not defined in environment variables');
    }

    const decoded: any = jwt.verify(token, secret);
    
    console.log('decode', decoded);
    
    if (decoded.userType !== userType) {
      console.log('Invalid userType')
      return res.status(403).json({ message: 'Forbidden: Invalid user type' });
    }

    req.userId = decoded.id; 
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(401).json({ message: 'Authentication error' });
  }
};

export default authMiddleware;
