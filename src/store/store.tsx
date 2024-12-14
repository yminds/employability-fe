import { configureStore } from "@reduxjs/toolkit";
import roleSlice from "./slices/roleSlice";
// import authSlice from "./slices/authSlice";
import { authApiSlice } from "./slices/authSlice";
import resumeSlice from "./slices/resumeSlice";
const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    role: roleSlice,
    // auth: authSlice, // Add your reducers here
    resume: resumeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

// Define RootState and AppDispatch types for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
