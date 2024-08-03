import * as Yup from 'yup';

export const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  files: Yup.array()
    .min(1, 'At least one file is required') // Ensures that there is at least one file
    .required('Files are required') // Ensures the files array is not empty
    .test(
      "fileType", // The name of the test
      "Only images and videos are allowed", // The error message if validation fails
      (value) => 
        value ? // Check if the value is defined (not null or undefined)
          value.every(
            val => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime']
              .includes(val.type) // Check if each file's type is one of the allowed MIME types
          ) 
        : true // If the value is not defined, the validation passes
    )
});
