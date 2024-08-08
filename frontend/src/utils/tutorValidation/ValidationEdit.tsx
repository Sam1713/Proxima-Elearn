import * as Yup from 'yup';

export const validationSchema = Yup.object({
    tutorname: Yup.string()
        .min(3, 'Tutor name must be at least 3 characters')
        .max(50, 'Tutor name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s]*$/, 'Tutor name can only contain letters and spaces'), 

    
    email: Yup.string()
        .email('Invalid email format'),
    
    phonenumber: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must only contain digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(10, 'Phone number must not exceed 15 digits')
});
