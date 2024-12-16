// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BedDouble } from "lucide-react";
// import {createApi} from '@reduxjs/toolkit/query/react'

const BASE_URL = "http://localhost:3000/api";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isWhatsAppEnabled: boolean;
  [key: string]: any; // For additional fields if needed
}

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  isWhatsAppEnabled: boolean;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  message: string;
}

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterUserPayload>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    loginUser: builder.mutation<AuthResponse, LoginUserPayload>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    fetchUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/status",
      }),
      providesTags: ["Auth"],
    }),

    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    updatePhone: builder.mutation<{ message: string }, { phoneNumber: string }>(
      {
        query: (data) => ({
          url: "/update-phone",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Auth"],
      }
    ),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useFetchUserQuery,
  useLogoutUserMutation,
  useUpdatePhoneMutation,
} = authApiSlice;
