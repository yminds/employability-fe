import { apiSlice } from "./apiSlice";

// Updated Interfaces to match backend model
export interface Company {
    _id: string;
    name: string;
    website: string;
    industry?: string;
    organization_size?: string; // Changed to match backend
    tagline?: string;
    location?: string; // Changed to simple string to match backend
    logo?: string;
    logoKey?: string; // For tracking S3 key
    employers?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Employer {
    _id: string;
    employerName: string;
    email: string;
    company?: Company; // Changed from company_id to company
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
        company?: Company; // Optional as it may not exist initially
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
    location?: string; // Changed to simple string to match backend
    phoneNumber?: number;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface CompanyResponse {
    success: boolean;
    message: string;
    company: Company;
}

// Company Creation Payload - updated to match backend model
interface CreateCompanyPayload {
    name: string;
    website: string;
    industry: string;
    organization_size: string; // Changed to snake_case
    location: string; // Simple string
    tagline?: string;
    logo?: string;
    logoKey?: string; // Added for S3 tracking
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
        
        // Create company endpoint - payload updated to match backend expectations
        createCompany: builder.mutation<CompanyResponse, { employerId: string; formData: CreateCompanyPayload }>({
            query: ({ employerId, formData }) => ({
                url: `/api/v1/employer/${employerId}/company`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ['Employer']
        }),
    }),
    overrideExisting: false
});

// Export hooks
export const {
    useEmployerSignupMutation,
    useEmployerLoginMutation,
    useGetEmployerDetailsQuery,
    useUpdateEmployerProfileMutation,
    useCreateCompanyMutation
} = employerApiSlice;