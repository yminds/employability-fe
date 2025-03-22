import { apiSlice } from "./apiSlice";

interface RegisterUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SocialAuthPayload {
  provider: "google" | "linkedin" | "github";
  token: string;
}

interface AuthResponse {
  success: boolean;
  user_info: any;
  token: any;
  user: User;
  message: string;
}

interface UpdateFirstTimeUserPayload {
  user_id: string; 
  phone_number?: string;
  experience_level?: "" | "entry" | "mid" | "senior"; 
}

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any; 
}

// New interfaces for phone verification
interface VerifyPhonePayload {
  userId: string;
  phoneNumber: string;
  countryCode: string;
}

interface VerifyOTPPayload {
  userId: string;
  otp: string;
}

interface PhoneVerificationResponse {
  success: boolean;
  message: string;
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
    socialAuth: builder.mutation<AuthResponse, SocialAuthPayload>({
      query: (credentials) => ({
        url: "/api/v1/user/social-auth",
        method: "POST",
        body: credentials,
      }),
    }),
    updateFirstTimeUser: builder.mutation<AuthResponse, UpdateFirstTimeUserPayload>({
      query: ({ user_id, ...data }) => ({
        url: `/api/v1/user/update-first-time/${user_id}`,
        method: "PUT",
        body: data,
      }),
    }),
    verifyPhone: builder.mutation<PhoneVerificationResponse, VerifyPhonePayload>({
      query: (data) => ({
        url: "/api/v1/phone/verify-phone",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation<PhoneVerificationResponse, VerifyOTPPayload>({
      query: (data) => ({
        url: "/api/v1/phone/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation<PhoneVerificationResponse, VerifyPhonePayload>({
      query: (data) => ({
        url: "/api/v1/phone/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useSocialAuthMutation,
  useUpdateFirstTimeUserMutation,
  useVerifyPhoneMutation,
  useVerifyOTPMutation,
  useResendOTPMutation
} = authApiSlice;