export interface FormDataType {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
export interface SigninType{
  email:string,
  password:string
}

export interface UpdateSudentType{
  username?:string,
  email?:string,
  profilePic?:string
}