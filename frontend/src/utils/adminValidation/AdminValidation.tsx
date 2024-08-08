import * as Yup from 'yup';

// Validation schema for signup
const signupValidationSchema = Yup.object({
    username: Yup.string()
        .matches(/^[A-Z][a-zA-Z]*$/, 'Username must start with a capital letter and contain only letters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\W_]/, 'Password must contain at least one special character')
        .required('Password is required'),
});

// Validation schema for signin
const signinValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\W_]/, 'Password must contain at least one special character')
        .required('Password is required'),
});

export const validationSchema = (formType: 'signup' | 'signin') => {
    return formType === 'signup' ? signupValidationSchema : signinValidationSchema;
};
