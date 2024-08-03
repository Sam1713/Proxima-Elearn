// studentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudentState {
    currentStudent: Student | null;
    loading: boolean;
    error: string | null;
}

export interface Student {
    id: string;
    username: string;
    email:string;
    profilePic?:string
    // Add other properties of Student as needed
}

const initialState: StudentState = {
    currentStudent: null,
    loading: false,
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
        }
    },
});

export const { signInStart, signInSuccess, signInFailure,signout,updateStart,updateSuccess } = studentSlice.actions;

export default studentSlice.reducer;
