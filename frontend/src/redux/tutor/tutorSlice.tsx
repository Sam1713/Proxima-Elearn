import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TutorSigninType } from "../../types/TutorTypes";
export interface TutorState {
    currentTutor: Tutor | null;
    tutorApproval:boolean;
    updateBasicTutor:updateBasic|null,
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
const initialState:TutorState={
    currentTutor:null,
    tutorApproval:false,
    updateBasicTutor:null,
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
        }

        
    }
})

export const { signinStart, signinSuccess, signinFailure,isTutorApproved,updateSuccessTutor,updateBio,updateFiles,licenseAgreement } = tutorSlice.actions;

export default tutorSlice.reducer;
