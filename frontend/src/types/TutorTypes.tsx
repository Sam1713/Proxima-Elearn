export interface TutorTypes{
    tutorname:string;
    email:string;
    password:string
    countrycode:number;
    phonenumber:number;
    bio:string;
    files?:[]
}

export interface TutorSigninType{
    email:string;
    password:string
} 