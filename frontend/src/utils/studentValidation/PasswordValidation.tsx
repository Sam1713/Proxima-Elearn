import * as Yup from 'yup'

export const validationSchema=Yup.object({
    currentPassword:Yup.string().required('RequiredCurrent Password'),
    newPassword:Yup.string().required('New Password Required')
})


export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_+{}[\]:;"'<>,.?~\\/-]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});
