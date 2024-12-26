import { createSlice } from "@reduxjs/toolkit";
import { Interview } from "@/models/Interview";

interface Transcription {
  role: "AI" | "User";
  message: string;
  timestamp: Date;
}

interface IInterview extends Interview {
  transcription: Transcription[];
}

const initialState: IInterview = {
  thread_id: "",
  title: "",
  type: "",
  user_id: "",
  user_skill_id: "",
  transcription: [],
};

const interviewSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInterview(state, action) {
      state = action.payload;
    },
  },
});

export const { setInterview } = interviewSlice.actions;

export default interviewSlice.reducer;
