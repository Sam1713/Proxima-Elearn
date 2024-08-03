import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TutorSigninType } from "../../types/TutorTypes";
export interface TutorState {
    currentTutor: Tutor | null;
    loading: boolean;
    error: string | null;
}

export interface Tutor {
    id: string;
    name: string;
    email:string;
    phonenumber:string;
    bio:string
    // Add other properties of Student as needed
}

const initialState:TutorState={
    currentTutor:null,
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
        }
    }
})

export const { signinStart, signinSuccess, signinFailure } = tutorSlice.actions;

export default tutorSlice.reducer;
