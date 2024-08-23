import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actions } from "react-table";

export interface Admin{
    id:string;
    username:string
    email:string;
    password:string;
    profilePic?:string
}
interface TutorDetails{
    _id:string,
    tutorname:string,
    email:string,
    phonenumber:string
}
interface EachTutor extends TutorDetails{
    bio:string,
    files:[],
}
interface AdminDetails{
    currentAdmin:Admin|null
    tutorDetails:TutorDetails[]
    singleTutor:EachTutor|null,
    singleCourseDetail:CourseDocument|null;
    isApproved:boolean,
    adminUsers:AdminUserListing[],
    getTutorCourses:TutorCourses[],
    viewAllCategory:Category[],
    eachCategory:Category|null
    loading:boolean;
    error:string|null
}
interface AdminUserListing{
    username:string,
    email:string,
    profilePic?:string
}

interface Category {
    _id: string;
    categoryName: string;
    catDescription: string;
  }
  
  interface TutorCourses{
    _id:string;
    title:string;
    price:string;
    category:string;
    coverImageUrl:string
  }
  
interface Video {
    fileUrl: string;
    description: string;
  }
  interface CourseDocument {
    _id: string;
    title: string;
    category: string;
    description: string;
    coverImageUrl: string;
    coverVideoUrl:string;
    lessons?: string;
    AboutCourse?: string;
    tutorDetails: TutorDetails;
    price: number;
    videos: Video[];
  }
  
const initialState:AdminDetails={
     currentAdmin:null,
     tutorDetails:[],
     adminUsers:[],
     viewAllCategory:[],
     getTutorCourses:[],
     singleCourseDetail:null,
     eachCategory:null,
     singleTutor:null,
     isApproved:false,
     loading:false,
     error:null
}

const AdminSlice=createSlice({
      name:'admin',
      initialState,
      reducers:{
        adminSignInStart:(state)=>{
            state.loading=true
        },
        adminSignInSuccess:(state,action:PayloadAction<Admin>)=>{
            state.currentAdmin=action.payload
            state.loading=false;
            state.error=null
        },
        adminSignInFailure:(state,action:PayloadAction<string>)=>{
            state.error=action.payload
        },
        adminStoreTutorDetails:(state,action:PayloadAction<TutorDetails[]>)=>{
            state.tutorDetails=action.payload
        },
        adminStoreEachTutorDetail:(state,action:PayloadAction<EachTutor>)=>{
             state.singleTutor=action.payload
        },
        tutorApproved:(state,action:PayloadAction<boolean>)=>{
            state.isApproved=action.payload
        },
        adminUsersFetch:(state,action:PayloadAction<AdminUserListing[]>)=>{
            state.adminUsers=action.payload
        },
        setAllCategory: (state, action: PayloadAction<Category[]>) => {
            state.viewAllCategory = action.payload;
          },
          setEachCategory:(state,action:PayloadAction<Category>)=>{
            state.eachCategory=action.payload
          },
          setTutorCourses:(state,action:PayloadAction<TutorCourses[]>)=>{
            state.getTutorCourses=action.payload
          },
          setCourseDetails:(state,action:PayloadAction<CourseDocument>)=>{
            state.singleCourseDetail=action.payload
          }

      }
})

export const {adminSignInStart,adminSignInSuccess,adminSignInFailure,adminStoreTutorDetails,adminStoreEachTutorDetail,tutorApproved,adminUsersFetch,setAllCategory,setEachCategory,setTutorCourses,setCourseDetails}=AdminSlice.actions
export default AdminSlice.reducer