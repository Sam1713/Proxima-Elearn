import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { TutorSigninType } from "../../types/TutorTypes";
export interface TutorState {
    currentTutor: Tutor | null;
    tutorApproval:boolean;
    updateBasicTutor:updateBasic|null,
    tutorUploadedCourses:TutorCourse[],
    tutorUploadedCourseDetail:TutorCourseDetail|null,
    categoryDetails:Category[],
    purchased:PurchasedStudentDetails[]
    CallRequestDetails:CallRequestType[],
    CallRequestAccept:CallRequestType|null,
    bookingDetails:CallRequestType|null,//changed callRequestType
    walletInfo:WalletDetailsTypes|null,
    quizDetails:StudentQuiz|null,
    allCategories:CategoryTypes[],
    studentChat: Record<string, StudentChatType[]>; // Use Record for dynamic keys
    sortedStudents: Student[];
    newBio?:UpdatedBio|null,
    loading: boolean;
    error: string | null;
}

export interface Student {
    _id: string;
    name: string;
    // Add other properties of Student as needed
}

export interface Tutor {
    id?: string;
    tutorname?: string;
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
    _id:string
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
    _id:string;
    username:string;
    email:string;
    title:string;
    category:string;
    profilePic:string
}
interface CallRequestType{
    createdAt: Date;
    _id:string;
    name:string;
    email:string;
    purpose:string;
    description?:string;
    status:string,
    courseId:string;
    tutorId:string;
    studentId:string;
    profilePic:string
    tutorResponse?:{
        responseDate?:string;
        startingTime?:string;
        endingTime?:string;
        notes?:string;
    }
}

interface WalletTypes{
    studentName:string;
    courseTitle:string;
    courseId:string;
    amountPaid:string;
    paymentDate:string;
}
interface WalletDetailsTypes{
    WalletDetails:WalletTypes[],
    deductedAmount:string;
    balanceAmount:string
}
interface Stud {
    courseId: string;
  }
  
  interface QuizQuestions {
    _id: string;
    question: string;
    options: string[];
    totalMarks: number; 
    correctAnswer: number; 
  }
  
  interface StudentQuiz extends Stud {
    questions: QuizQuestions[];
  }

interface StudentChatType{
    sender:string;
    receiver:string
    createdAt:Date;
    senderType:string
}

interface CategoryTypes{
    _id:string;
    categoryName:string;
}

const initialState:TutorState={
    currentTutor:null,
    tutorApproval:false,
    updateBasicTutor:null,
    tutorUploadedCourses:[],
    tutorUploadedCourseDetail:null,
    CallRequestDetails:[],
    CallRequestAccept:null,
    bookingDetails:null,
    walletInfo:null,
    quizDetails:null,
    allCategories:[],
    studentChat:{},
    categoryDetails:[],
    purchased:[],
    sortedStudents: [],
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
        },
        setCallRequests:(state,action:PayloadAction<CallRequestType[]>)=>{
            state.CallRequestDetails=action.payload
        },
        setCallRequestAccept:(state,action:PayloadAction<CallRequestType>)=>{
            state.CallRequestAccept=action.payload
        },
        setBookingDetails:(state,action:PayloadAction<CallRequestType>)=>{
            state.bookingDetails=action.payload
        },
        setWalletInfo:(state,action:PayloadAction<WalletDetailsTypes>)=>{
            state.walletInfo=action.payload
        },
    
        setStudentChat(state, action: PayloadAction<{ studentId: string, chats: StudentChatType[] }>) {
            const { studentId, chats } = action.payload;
            
            // Update student chat data
            const updatedChats = {
                ...state.studentChat,
                [studentId]: chats,
            };
            state.studentChat = updatedChats;

            // Update sorted students list
            const sortedStudents = state.sortedStudents
                .map(student => ({
                    ...student,
                    lastMessageTimestamp: updatedChats[student._id]?.[chats.length - 1]?.createdAt.getTime() || 0,
                }))
                .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

            state.sortedStudents = sortedStudents;
        },
        setQuizDetails:(state,action:PayloadAction<StudentQuiz>)=>{
            state.quizDetails=action.payload
        },
        setTutorCategories:(state,action:PayloadAction<CategoryTypes[]>)=>{
            state.allCategories=action.payload
        }
    },
});

export const { signinStart, signinSuccess, signinFailure,tutorsignout,isTutorApproved,updateSuccessTutor,updateBio,updateFiles,licenseAgreement,setUploadedCourses,setUploadedCoursesDetails,setPurchasedStudents,setCategoryDetails,setCallRequests,setCallRequestAccept,setBookingDetails,setWalletInfo,setStudentChat,setQuizDetails,setTutorCategories } = tutorSlice.actions;

export default tutorSlice.reducer;
