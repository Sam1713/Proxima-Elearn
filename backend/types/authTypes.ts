export interface StudentDetails {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface SigninType{
    email:string;
    password:string
}

export interface ForgotPasswordType{
    email:string
}

export interface AdminSignupType{
  username:string
  email:string
  password:string
  profilePic?:string
}