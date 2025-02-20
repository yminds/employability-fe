
import { apiSlice } from "./apiSlice";

// Interfaces
export interface Company {
    _id: string;
    name: string;
    website: string;
    industry?: string;
    location?: {
        country: string;
        state: string;
        city: string;
    };
}

export interface Employer {
    _id: string;
    employerName: string;
    email: string;
    company_id: Company;
    role: "admin" | "member";
    profile_image?: string;
    contact?: {
        phone?: string;
        alternative_email?: string;
    };
    is_email_verified: boolean;
    account_status: "active" | "disabled" | "suspended";
    posted_jobs?: string[];
    active_jobs?: string[];
    createdAt: string;
    updatedAt: string;
}

// Response Interfaces
interface EmployerAuthResponse {
    success: boolean;
    message: string;
    token: string;
    data: {
        employer_info: Employer;
        company: Company;
    };
}

interface EmployerResponse {
    success: boolean;
    data: Employer;
}

// Request Payload Interfaces
interface SignupPayload {
    employerName: string;
    email: string;
    password: string;
    companyName: string;
    website: string;
    industry?: string;
    location?: {
        country: string;
        state: string;
        city: string;
    };
}

interface LoginPayload {
    email: string;
    password: string;
}


interface UpdateProfilePayload {
    employerName?: string;
    profile_image?: string;
    contact?: {
        phone?: string;
        alternative_email?: string;
    };
}

// API Slice
export const employerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Signup endpoint
        EmployerSignup: builder.mutation<EmployerAuthResponse, SignupPayload>({
            query: (data) => ({
                url: "/api/v1/employer/signup",
                method: "POST",
                body: data
            }),
        }),

        // Login endpoint
        EmployerLogin: builder.mutation<EmployerAuthResponse, LoginPayload>({
            query: (data) => ({
                url: "/api/v1/employer/login",
                method: "POST",
                body: data
            }),
        }),

        // Get employer details
        getEmployerDetails: builder.query<EmployerResponse, string>({
            query: (employerId) => ({
                url: `/api/v1/employer/${employerId}`,
                method: "GET",
            }),
            providesTags: ['Employer']
        }),

        // Update employer profile
        updateEmployerProfile: builder.mutation<EmployerResponse, { id: string; data: UpdateProfilePayload }>({
            query: ({ id, data }) => ({
                url: `/api/v1/employer/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['Employer']
        }),
    })
});

// Export hooks
export const {
    useEmployerSignupMutation,
    useEmployerLoginMutation,
    useGetEmployerDetailsQuery,
    useUpdateEmployerProfileMutation
} = employerApiSlice;