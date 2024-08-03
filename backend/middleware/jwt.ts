import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include userId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('toj',token)
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//   console.log('Token received:', token);

//   try {
//     const decoded: any = jwt.verify(token, process.env.STUDENT_JWT_SECRET as string);
//     req.userId = decoded.id; // Attach user ID to request
//     console.log('Decoded token:', decoded);
//     next();
//   } catch (error) {
//     console.log('Token verification error:', error);
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ message: 'Token has expired' });
//     }
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     return res.status(401).json({ message: 'Authentication error' });
//   }
// };

// export default authMiddleware;


 const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('afassfs')
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('cook',req.cookies)
  console.log('Token received:', token);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.STUDENT_JWT_SECRET as string);
    req.userId = decoded.id; // Attach user ID to request
    console.log('Decoded token:', decoded);
    next();
  } catch (error) {
    console.log('Token verification error:', error);
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
