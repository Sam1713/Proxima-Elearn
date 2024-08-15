import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Video {
    fileUrl: string;
    description: string;
  }
  interface TutorDetails{
    tutorname?:string
    email?:string
    phonenumber?:string
    bio?:string
  }
  
  // Define the CourseDocument interface
  interface CourseDocument {
    _id: string;
    title: string;
    category: string;
    description: string;
    coverImageUrl: string;
    lessons?:string,
    AboutCourse?:string,
    tutorDetails: TutorDetails;
    price:number,
    videos: Video[];
  }
  

  interface CourseState {
    courses: CourseDocument[];
    singleCourse:CourseDocument|null;
    orderedCourses:PurchasedCourse[];
    orderedCourseDetail:MyCourse|null;
    loading: boolean;
    error: string | null;
  }
  interface Tutor {
    tutorname: string;
  }
  interface Course {
    _id?: string;
    title?: string;
    description?: string;
    coverImageUrl?: string;
    Tutors?: Tutor[];
  }
  
  interface PurchasedCourse {
    _id: string;
    Courses: Course;
  }
  interface MyCourse{
    Courses:CourseDocument
  }
  const initialState:CourseState={
    courses: [], // Initial state is an empty array for courses
    singleCourse:null,
    orderedCourses:[],
    orderedCourseDetail:null,
    loading: false,
    error: null,
  }

  const courseSlice=createSlice({
    name:'courses',
    initialState,
    reducers:{
        setCourses(state,action: PayloadAction<CourseDocument[]>){
            state.courses=action.payload
        },
        setSingleCourse(state,action:PayloadAction<CourseDocument>){
            state.singleCourse=action.payload
        },
        orderedCourse(state,action:PayloadAction<PurchasedCourse[]>){
            state.orderedCourses=action.payload
        },
        setOrderedCourseDetails(state,action:PayloadAction<MyCourse>){
          state.orderedCourseDetail=action.payload
        }
    }
  })

  export const{setCourses,setSingleCourse,orderedCourse,setOrderedCourseDetails}=courseSlice.actions
  export default courseSlice.reducer