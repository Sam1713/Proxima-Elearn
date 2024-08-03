import * as Yup from 'yup';

export const validationSchema = Yup.object({
  username: Yup.string(),
  email: Yup.string().email('Invalid Email Address'),
  profilePic: Yup.mixed()
});


