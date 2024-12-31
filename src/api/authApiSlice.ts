import { apiSlice } from "./apiSlice";

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  message: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // For additional fields if needed
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/user/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    registerUser: builder.mutation<AuthResponse, RegisterUserPayload>({
      query: (data) => ({
        url: "/api/v1/user/signup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterUserMutation } = authApiSlice;
