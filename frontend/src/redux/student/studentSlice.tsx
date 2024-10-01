// studentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { string } from "yup";

export interface StudentState {
    currentStudent: Student | null;
    courses:Course[];
    fullCourses:Course[];
    callDetails:CallRequestType|null;
    Notifications:NotificationType[];
    StudentQuizDetails:StudentQuiz|null;
    bookingId:getBookingId|null;
    quizResult:QuizResultType|null;
    categories:Category[]
    resultQuiz:ResultTypes|null;
    messageCount:number|null;
    unreadMessages: UnreadMessagesState; // Map of unread message statuses
    receiverId:String|null;
    loading: boolean;
    error: string | null;
}

export interface Student {
    _id: string;
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
  interface CallRequestType{
    _id:string;
    name:string;
    email:string;
    purpose:string;
    description?:string;
    status:string,
    courseId:string;
    tutorId:string;
    studentId:string;
    profilePic:string;
    callId:string;
    tutorResponse?:{
        responseDate?:string;
        startingTime?:string;
        endingTime?:string;
        notes?:string;
    }
}
interface getBookingId{
    id:string
}


interface Category {
  _id: string;
  categoryName: string;
  catDescription: string;
}
interface NotificationType{
    _id:string;
    studentId?:string;
    tutorId?:string;
    courseId?:string;
    type: 'booking' | 'courses' | 'default';
    global?:boolean;
    message:string;
    createdAt:Date;
}
interface Stud {
    courseId: string;
  }
  
  interface QuizQuestions {
    _id: string;
    question: string;
    options: string[];
    totalMarks: number; // Use number instead of string for numeric values
    correctAnswer: number; // Use number instead of string for numeric values
  }
  
  interface StudentQuiz extends Stud {
    questions: QuizQuestions[];
  }

  interface QuizResultType{
    courseId:string;
    correctCount:number;
    percentage:number
  }
  interface ResultTypes{
    result:number,totalMarks:number
  }
  interface UnreadMessagesState {
    [tutorId: string]: boolean; // true if there are unread messages from the tutor, false otherwise
  }
  
  
const initialState: StudentState = {
    currentStudent: null,
    loading: false,
    callDetails:null,
    bookingId:null,
    courses:[],
    fullCourses:[],
    StudentQuizDetails:null,
    categories:[],
    unreadMessages:{},
    receiverId:null,
    quizResult:null,
    resultQuiz:null,
    messageCount:null,
    Notifications:[],
    // messageNotification:0,
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
        signInFailure: (state) => {
            state.loading = false;
        },
        signout:(state)=>{
            state.currentStudent=null;
            state.loading=false;
            state.error=null
        },
        setLoading:(state)=>{
          state.loading=true
        },
        setLoadingClose:(state)=>{
          state.loading=false
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
        setFullCourses:(state,action:PayloadAction<Course[]>)=>{
          state.fullCourses=action.payload
        },
        setCallDetails:(state,action:PayloadAction<CallRequestType>)=>{
            state.callDetails=action.payload
        },
        setStudentNotifications:(state,action:PayloadAction<NotificationType[]>)=>{
            console.log('Setting notifications:', action.payload);
            state.Notifications=action.payload
        },
        setCategories:(state,action:PayloadAction<Category[]>)=>{
          state.categories=action.payload
        },
        setBookingId:(state,action:PayloadAction<getBookingId>)=>{
            state.bookingId=action.payload
        },
        setRemoveNotification: (state, action: PayloadAction<string>) => {
            console.log('Before removal:', state.Notifications);
            state.Notifications = state.Notifications.filter(
              (notification) => notification._id !== action.payload
            );
            console.log('After removal:', state.Notifications);
          },
          setStudentQuizDetails:(state,action:PayloadAction<StudentQuiz>)=>{
            state.StudentQuizDetails=action.payload
          },
          setQuizResult:(state,action:PayloadAction<QuizResultType>)=>{
            state.quizResult=action.payload
          },
          setRemoveQuiz:(state)=>{
            state.quizResult=null
          },
          setResult:(state,action:PayloadAction<ResultTypes>)=>{
            state.resultQuiz=action.payload
          },
          setMessageNotification(state, action: PayloadAction<number>) {
            // Increment the message count by the payload
            console.log('sadas',state.messageCount)
            state.messageCount = action.payload; 
            console.log('After removal:', state.messageCount);

          },
          resetMessageNotification(state) {
            state.messageCount = 0; // Reset to zero
          },
          setUnreadMessagesRedux: (state, action: PayloadAction<{ tutorId: string; isUnread: boolean }>) => {
            const { tutorId, isUnread } = action.payload;
            console.log('Setting unread status:', { tutorId, isUnread });
          
            // Ensure the unreadMessages object exists
            if (!state.unreadMessages) {
              state.unreadMessages = {}; // Initialize if it's undefined
            }
          
            // Set the unread status for the tutor
            state.unreadMessages[tutorId] = isUnread;
          },
          setRecieverIds:(state,action:PayloadAction<string>)=>{
            state.receiverId=action.payload
          }
          
        
    },
});

export const { signInStart, signInSuccess, signInFailure,signout,setLoading,setLoadingClose,updateStart,updateSuccess,setStudentCourses,setFullCourses,setCallDetails,setCategories,setStudentNotifications,setRemoveNotification,setBookingId,setStudentQuizDetails,setQuizResult,setRemoveQuiz,setResult,setMessageNotification,setUnreadMessagesRedux,setRecieverIds,resetMessageNotification } = studentSlice.actions;

export default studentSlice.reducer;
