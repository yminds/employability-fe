import { configureStore } from "@reduxjs/toolkit";

// Slices
import resumeSlice from "./slices/resumeSlice";
import roleSlice from "./slices/roleSlice";


const store = configureStore({
  reducer: {
    role: roleSlice,
    resume: resumeSlice,
  },
  // middleware: (getDefaultMiddleware) => {}
});

// Define RootState and AppDispatch types for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
