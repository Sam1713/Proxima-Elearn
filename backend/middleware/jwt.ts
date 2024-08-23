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


//  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   console.log('afassfs')
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('cook',req.cookies)
//   console.log('Token received:', token);

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }

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




// const authMiddleware = (userType: 'student' | 'admin' | 'tutor') => (req: Request, res: Response, next: NextFunction) => {
//   console.log('cook',req.cookies)
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('Token received:', token);

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }

//   try {
//     let secret: string | undefined;

//     switch (userType) {
//       case 'student':
//         secret = process.env.STUDENT_JWT_SECRET;
//         break;
//       case 'admin':
//         secret = process.env.ADMIN_JWT_KEY;
//         break;
//       case 'tutor':
//         secret = process.env.TUTOR_SECRET_KEY;
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid user type' });
//     }

//     if (!secret) {
//       throw new Error('JWT secret is not defined in environment variables');
//     }

//     const decoded: any = jwt.verify(token, secret);
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


const authMiddleware = (userType: 'student' | 'admin' | 'tutor') => (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('token',token)
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    let secret: string | undefined;

    switch (userType) {
      case 'student':
        secret = process.env.STUDENT_JWT_SECRET as string;
        break;
      case 'admin':
        secret = process.env.ADMIN_JWT_KEY as string;
        break;
      case 'tutor':
        secret = process.env.TUTOR_SECRET_KEY as string;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
  console.log('secret',secret)
    if (!secret) {
      throw new Error('JWT secret is not defined in environment variables');
    }

    const decoded:any = jwt.verify(token, secret);
    
    console.log('decode',decoded)
    req.userId = (decoded as any).id; // Attach user ID to request
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