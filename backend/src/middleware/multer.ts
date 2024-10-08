// import multer from 'multer';
// import path from 'path';

// // Multer Configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./backend/uploads/tutorFiles");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });  

// const upload = multer({ storage });

// export default upload;


// import multer from 'multer';
// import path from 'path';

// // Generic Multer Configuration Function
// const createMulterConfig = (destination: string) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, destination);
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   });

//   return multer({ storage });
// };
 
import multer from 'multer';
import path from 'path';

const createMulterConfig = (destination: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/mov'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type') as any, false); 
    }
  };

  const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB
  };

  return multer({ storage, fileFilter, limits });
};

export default createMulterConfig;
