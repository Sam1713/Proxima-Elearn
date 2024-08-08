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
    singleTutor:EachTutor|null
    isApproved:boolean,
    adminUsers:AdminUserListing[]
    loading:boolean;
    error:string|null
}
interface AdminUserListing{
    username:string,
    email:string,
    profilePic?:string
}

const initialState:AdminDetails={
     currentAdmin:null,
     tutorDetails:[],
     adminUsers:[],
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
        }

      }
})

export const {adminSignInStart,adminSignInSuccess,adminSignInFailure,adminStoreTutorDetails,adminStoreEachTutorDetail,tutorApproved,adminUsersFetch}=AdminSlice.actions
export default AdminSlice.reducer