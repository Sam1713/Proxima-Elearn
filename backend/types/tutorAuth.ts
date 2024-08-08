export interface tutorAuthTypes{
    tutorname:string;
    email:string;
    countrycode:string;
    phonenumber:string;
    password:string;
    bio:string;
    files:Array<string>
}
export interface TutorSigninType{
    email:string;
    password:string
} 