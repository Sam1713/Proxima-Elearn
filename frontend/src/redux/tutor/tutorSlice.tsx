import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TutorSigninType } from "../../types/TutorTypes";
export interface TutorState {
    currentTutor: Tutor | null;
    tutorApproval:boolean;
    updateBasicTutor:updateBasic|null,
    tutorUploadedCourses:TutorCourse[],
    tutorUploadedCourseDetail:TutorCourseDetail|null,
    categoryDetails:Category[],
    purchased:PurchasedStudentDetails[]
    newBio?:UpdatedBio|null,
    loading: boolean;
    error: string | null;
}

export interface Tutor {
    id?: string;
    name?: string;
    email?:string;
    phonenumber?:string;
    bio?:string,
    isApproved?:boolean,
    license?:false
    files?:[]
    // Add other properties of Student as needed
}
export interface updateBasic{
   id?:string;
   tutorname?:string;
   email?:string;
   phonenumber?:string
}
export interface UpdatedBio{
    bio?:string
}

export interface TutorCourse{
    courseId:string
    title:string;
    description:string;
    coverImageUrl:string;
    category:string;
}
interface Video {
    fileUrl: string;
    description: string;
    videoId:string;
  }
export interface TutorCourseDetail extends TutorCourse{
    price:string;
    coverVideoUrl:string;
    lessons:string;
    AboutCourse:string;
    videos:Video[]

}

export interface Category{
    id:string,
    categoryName:string,
    catDescription:string
}


interface PurchasedStudentDetails{
    username:string;
    email:string;
    title:string;
    category:string;
    profilePic:string
}

const initialState:TutorState={
    currentTutor:null,
    tutorApproval:false,
    updateBasicTutor:null,
    tutorUploadedCourses:[],
    tutorUploadedCourseDetail:null,
    categoryDetails:[],
    purchased:[],
    newBio:null,
    loading:false,
    error:""
}

const tutorSlice=createSlice({
    name:"tutor",
    initialState,
    reducers:{
        signinStart(state){
           state.loading=true
        },
        signinSuccess(state,action){
            state.currentTutor=action.payload
            state.loading=false
            state.error=null
        },
        signinFailure(state,action){
            state.loading=false
            state.error=action.payload
        },
        tutorsignout(state){
            state.loading=false,
            state.currentTutor=null
        },
        isTutorApproved(state,action){
            state.tutorApproval=action.payload
        },
        updateSuccessTutor:(state,action:PayloadAction<Tutor>)=>{
            state.currentTutor=action.payload;
            state.loading=false
            state.error=null
        },
        updateBio:(state,action:PayloadAction<Tutor>)=>{
            state.currentTutor=action.payload
        },
        updateFiles:(state,action:PayloadAction<Tutor>)=>{
            state.currentTutor=action.payload
        },
        licenseAgreement:(state,action:PayloadAction<Tutor>)=>{
            state.currentTutor=action.payload
        },
        setUploadedCourses:(state,action:PayloadAction<TutorCourse[]>)=>{
            state.tutorUploadedCourses=action.payload
        },
        setUploadedCoursesDetails:(state,action:PayloadAction<TutorCourseDetail>)=>{
            state.tutorUploadedCourseDetail=action.payload
        },
        setPurchasedStudents:(state,action:PayloadAction<PurchasedStudentDetails[]>)=>{
            state.purchased=action.payload
        },
        setCategoryDetails:(state,action:PayloadAction<Category[]>)=>{
            state.categoryDetails=action.payload
        }

        
    }
})

export const { signinStart, signinSuccess, signinFailure,tutorsignout,isTutorApproved,updateSuccessTutor,updateBio,updateFiles,licenseAgreement,setUploadedCourses,setUploadedCoursesDetails,setPurchasedStudents,setCategoryDetails } = tutorSlice.actions;

export default tutorSlice.reducer;
