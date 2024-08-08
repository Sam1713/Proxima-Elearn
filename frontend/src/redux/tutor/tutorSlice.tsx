import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TutorSigninType } from "../../types/TutorTypes";
export interface TutorState {
    currentTutor: Tutor | null;
    tutorApproval:boolean;
    updateBasicTutor:updateBasic|null
    loading: boolean;
    error: string | null;
}

export interface Tutor {
    id?: string;
    name?: string;
    email?:string;
    phonenumber?:string;
    bio?:string,
    isApproved?:boolean
    // Add other properties of Student as needed
}
export interface updateBasic{
   id?:string;
   tutorname?:string;
   email?:string;
   phonenumber?:string
}
const initialState:TutorState={
    currentTutor:null,
    tutorApproval:false,
    updateBasicTutor:null,
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
        isTutorApproved(state,action){
            state.tutorApproval=action.payload
        },
        updateSuccessTutor:(state,action:PayloadAction<Tutor>)=>{
            state.currentTutor=action.payload;
            state.loading=false
            state.error=null
        }

        
    }
})

export const { signinStart, signinSuccess, signinFailure,isTutorApproved,updateSuccessTutor } = tutorSlice.actions;

export default tutorSlice.reducer;
