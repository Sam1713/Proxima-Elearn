import * as Yup from 'yup';

export const validationSchema = Yup.object({
    email: Yup.string()
      .required('Tutor email is required')
      .min(2, 'Tutor Name must be at least 2 characters'),
 password: Yup.string()
      .email('Invalid password')
      .required('password is required')
  });