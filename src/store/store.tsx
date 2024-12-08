import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import resumeSlice from "./slices/resumeSlice";
const store = configureStore({
  reducer: {
    auth: authSlice, // Add your reducers here
    resume: resumeSlice,
  },
});

// Define RootState and AppDispatch types for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
