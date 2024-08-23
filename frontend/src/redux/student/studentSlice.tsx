// studentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudentState {
    currentStudent: Student | null;
    courses:Course[];
    loading: boolean;
    error: string | null;
}

export interface Student {
    id: string;
    username: string;
    email:string;
    profilePic?:string
    isBlocked?:boolean
    // Add other properties of Student as needed
}
interface Tutor {
    tutorname: string;
    bio?:string;
  }
  
interface Course {
    _id: string;
    title: string;
    category: string;
    description: string;
    coverImageUrl: string;
    lessons?: string;
    AboutCourse?: string;
    tutorDetails: Tutor;
    price: number;

  }
const initialState: StudentState = {
    currentStudent: null,
    loading: false,
    courses:[],
    error: null,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action: PayloadAction<Student>) => {
            state.currentStudent = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        signout:(state)=>{
            state.currentStudent=null;
            state.loading=false;
            state.error=null
        },
        updateStart:(state)=>{
            state.loading=true
        },
        updateSuccess:(state,action:PayloadAction<Student>)=>{
            state.currentStudent=action.payload;
            state.loading=false
            state.error=null
        },
        setStudentCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses =action.payload; // Merge new courses
        },
        
    },
});

export const { signInStart, signInSuccess, signInFailure,signout,updateStart,updateSuccess,setStudentCourses } = studentSlice.actions;

export default studentSlice.reducer;
