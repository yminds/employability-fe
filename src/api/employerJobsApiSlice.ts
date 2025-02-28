import { apiSlice } from "./apiSlice";
import { Company, Employer } from "./employerApiSlice";

// Job Interfaces based on MongoDB Schema
export interface SalaryRange {
    min: number;
    max: number;
    currency: string;
}

export interface ScreeningQuestion {
    question: string;
    type: "multiple_choice" | "yes_no" | "text";
    options?: string[];
    is_mandatory: boolean;
    is_eliminatory: boolean;
}

export interface JobLocation {
    type: "remote" | "hybrid" | "on-site";
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
}

export interface Job {
    _id: string;
    company: string | Company;
    employer: string | Employer;
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    work_type: "full-time" | "part-time" | "contract" | "internship";
    experience_level: "entry" | "intermediate" | "senior" | "executive";
    location: JobLocation;
    salary_range: SalaryRange;
    skills_required: string[];
    screening_questions: ScreeningQuestion[];
    status: "active" | "closed";
    application_deadline?: string; // ISO date string
    createdAt: string;
    updatedAt: string;
}

// Response Interfaces
interface JobResponse {
    success: boolean;
    data: Job;
}

interface JobsListResponse {
    success: boolean;
    data: Job[];
    total: number;
    page: number;
    limit: number;
}

// Request Payload Interfaces
interface CreateJobPayload {
    company: string;
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    work_type: "full-time" | "part-time" | "contract" | "internship";
    experience_level: "entry" | "intermediate" | "senior" | "executive";
    location: JobLocation;
    salary_range: SalaryRange;
    skills_required: string[];
    screening_questions?: ScreeningQuestion[];
    status?: "active" | "closed";
    application_deadline?: string; // ISO date string
}

interface UpdateJobPayload extends Partial<CreateJobPayload> {}

interface SearchJobsParams {
    keyword?: string;
    location_type?: "remote" | "hybrid" | "on-site";
    country?: string;
    city?: string;
    experience_level?: "entry" | "intermediate" | "senior" | "executive";
    work_type?: "full-time" | "part-time" | "contract" | "internship";
    skills?: string; // Comma-separated list of skills
    min_salary?: number;
    max_salary?: number;
    currency?: string;
    page?: number;
    limit?: number;
}

// API Slice for Jobs
export const employerJobsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create job posting
        createJobPosting: builder.mutation<JobResponse, CreateJobPayload>({
            query: (data) => ({
                url: "/api/v1/employer/jobs",
                method: "POST",
                body: data
            }),
        }),

        // Update job
        updateJob: builder.mutation<JobResponse, { id: string; data: UpdateJobPayload }>({
            query: ({ id, data }) => ({
                url: `/api/v1/employer/jobs/${id}`,
                method: "PUT",
                body: data
            }),
        }),

        // Delete job
        deleteJob: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/api/v1/employer/jobs/${id}`,
                method: "DELETE"
            }),
        }),

        // Get company jobs
        getCompanyJobs: builder.query<JobsListResponse, { company_id: string; page?: number; limit?: number }>({
            query: ({ company_id, page = 1, limit = 10 }) => ({
                url: `/api/v1/employer/company/${company_id}/jobs`,
                method: "GET",
                params: { page, limit }
            }),
        }),

        // Get manageable jobs for an employer
        getManageableJobs: builder.query<JobsListResponse, { employer_id: string; page?: number; limit?: number }>({
            query: ({ employer_id, page = 1, limit = 10 }) => ({
                url: `/api/v1/employer/employer/${employer_id}/manageable-jobs`,
                method: "GET",
                params: { page, limit }
            }),
        }),

        // Search jobs
        searchJobs: builder.query<JobsListResponse, SearchJobsParams>({
            query: (params) => ({
                url: `/api/v1/employer/jobs/search`,
                method: "GET",
                params
            })
        }),

        // Get job details
        getJobDetails: builder.query<JobResponse, string>({
            query: (id) => ({
                url: `/api/v1/employer/jobs/${id}`,
                method: "GET"
            }),
        })
    })
});

// Export hooks
export const {
    useCreateJobPostingMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
    useGetCompanyJobsQuery,
    useGetManageableJobsQuery,
    useSearchJobsQuery,
    useGetJobDetailsQuery
} = employerJobsApiSlice;