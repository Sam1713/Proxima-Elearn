import * as Yup from 'yup';

// Validation schema
export const validationSchema = Yup.object({
  tutorname: Yup.string()
    .matches(/^[A-Z][a-zA-Z]*$/, 'Tutor name must start with a capital letter and contain only letters')
    .required('Tutor name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one special character')
    .required('Password is required'),

  countrycode: Yup.string()
    .required('Country code is required'),

  phonenumber: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only numbers')
    .required('Phone number is required'),

  bio: Yup.string()
    .min(50, 'Bio must contain at least 50 words')
    .required('Bio is required'),

  files: Yup.array()
    .of(Yup.mixed().required('File is required'))
});


