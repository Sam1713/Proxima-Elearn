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


import multer from 'multer';
import path from 'path';

// Generic Multer Configuration Function
const createMulterConfig = (destination: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  return multer({ storage });
};

export default createMulterConfig;
