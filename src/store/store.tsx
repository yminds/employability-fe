import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "@/features/authentication/authSlice";
import goalReducer from "@/features/goals/goalSlice";
import errorReducer from "@/features/error/errorSlice";
import successReducer from "@/features/success/successSlice";
import resumeSlice from "./slices/resumeSlice";
import roleSlice from "./slices/roleSlice";

import { apiSlice } from "../api/apiSlice";
import { errorMiddleware } from "./errorMiddleware";
// import { successMiddleware } from './successMiddleware';

// Redux persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "onboarding", "clinicOnboarding"],
};

// Combined root reducer
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  goals: goalReducer,
  error: errorReducer,
  success: successReducer,
  role: roleSlice,
  resume: resumeSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Customized middleware
const customizedMiddleware = {
  serializableCheck: {
    ignoredPaths: ["api.mutations"], // Adjust this path as needed
    ignoredActionPaths: [
      "payload",
      "meta.arg.originalArgs",
      "meta.baseQueryMeta.request",
      "meta.baseQueryMeta.response",
    ], // Add the full path to the payload
  },
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(customizedMiddleware).concat(
      apiSlice.middleware,
      errorMiddleware
    ),
  devTools: true,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
