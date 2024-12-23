import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
 
}

const initialState: AuthState = {
 
};

const goalsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  
  },
});

export const {  } = goalsSlice.actions;

export default goalsSlice.reducer;
