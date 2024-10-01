import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Feed {
  username: ReactNode;
  title: string;
  content: string;
  files: FileType[];
  createdAt:Date;
  userDetails:{
    username:string;
    email:string
    profilePic:string
  }
}
interface FileType{
  _id:string;
  fileType:string;
  url:string;

}
interface FeedDetails {
  feeds:Feed[]
  feed:Feed|null
  loading: boolean;
  error: string | null;
}

const initialState: FeedDetails = {
  feeds:[],
  feed:null,
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {

    setFeeds(state,action){
      state.feeds=action.payload;
      state.loading=false
      state.error=null
    },
    
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // Action to set an error message
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    // Action to clear the current feed (optional)
    clearFeed(state) {
      state.feeds= [];
      state.error = null;
    },
    setCurrentFeed(state,action:PayloadAction<Feed>){
      state.feed=action.payload
    }
  },
});

export const { setFeeds, setLoading, setError,clearFeed,setCurrentFeed } = feedSlice.actions;

export default feedSlice.reducer;
