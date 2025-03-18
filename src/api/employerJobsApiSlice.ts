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
    type: "multiple_choice" | "yes_no" | "text" | "numeric";
    options?: string[];
    is_mandatory: boolean;
    is_eliminatory: boolean;
    ideal_answer?: string;
    customField?: string;
    customFieldValue?: string;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    category?: string;
}

export interface JobLocation {
    type: "remote" | "hybrid" | "on-site";
    city?: string;
    country?: string;
}

export interface Skill {
    _id: string;
    name: string;
    icon?: string;
}

export interface SelectedSkill {
    skill: Skill;
    importance: "Must-Have*" | "Preferred" | "Optional";
}

export interface Contact {
    email: string;
    phone: string;
    linkedin?: string;
    address?: string;
    github?: string;
    portfolio?: string;
}

export interface Education {
    degree: string;
    institution: string;
    location: string;
    graduationYear?: number;
}

export interface Experience {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface Candidate {
    _id: string;
    name: string;
    contact: Contact;
    summary?: string;
    company_id?: string;
    employer_id?: string;
    job_id?: string[];
    screeningCard?: string[];
    skills: string[];
    softSkills?: string[];
    education: Education[];
    experience: Experience[];
    certifications?: any[];
    projects?: any[];
    languages?: any[];
    awards?: any[];
    interests?: string[];
    role?: string;
    experience_level?: string;
    is_verified?: boolean;
    verification_date?: string;
    verification_score?: number;
    created_at?: string;
    updated_at?: string;
}

interface CandidatesResponse {
    success: boolean;
    count?: number;
    data: Candidate[];
    message?: string;
}

export interface MatchedCandidate {
    _id: string;
    name: string;
    email: string;
    profile_image?: string;
    experience_level?: string;
    bio?: string;
    current_status?: string;
    skills: {
        skill_pool_id: string;
        skill_name?: string;
        verified_rating: number;
        level: string;
        self_rating?: number;
        strengths?: string[];
        areas_for_improvement?: string[];
    }[];
}

interface MatchedCandidatesResponse {
    success: boolean;
    data: MatchedCandidate[];
    message?: string;
}

export interface Job {
    _id: string;
    company: string | Company;
    employer: string | Employer;
    title: string;
    description: string;
    job_type: "full-time" | "part-time" | "contract" | "internship";
    experience_level: "entry" | "intermediate" | "senior" | "executive";
    location: string;
    work_place_type: "remote" | "hybrid" | "on-site";
    salary_range: SalaryRange;
    skills_required: Array<{
        _id: string;
        name: string;
        importance: string;
    }>;
    screening_questions: ScreeningQuestion[];
    interview_questions?: InterviewQuestion[];
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
export interface CreateJobPayload {
    company: string;
    title: string;
    description: string;
    job_type: "full-time" | "part-time" | "contract" | "internship";
    experience_level: "entry" | "intermediate" | "senior" | "executive";
    location: string;
    work_place_type: "remote" | "hybrid" | "on-site";
    salary_range: SalaryRange;
    skills_required: Array<{
        _id: string;
        name: string;
        importance: string;
    }>;
    screening_questions?: ScreeningQuestion[];
    interview_questions?: InterviewQuestion[];
    status?: "active" | "closed";
    application_deadline?: string; // ISO date string
}

// This interface matches the formData structure from BasicInfoForm
export interface JobFormData {
    title: string;
    description: string;
    location: string;
    job_type: string;
    work_place_type: string;
    experience_level: string;
    company_name?: string;
    company_id?: string;
    employer_id?: string;
    job_id?: string;
    skills_required: SelectedSkill[];
    screening_questions: ScreeningQuestion[];
    interview_questions: InterviewQuestion[];
}

// Utility function to transform frontend form data to API payload
export const transformFormDataToPayload = (formData: JobFormData): CreateJobPayload => {
    // Map experience_level to API format
    const experienceLevelMap: Record<string, "entry" | "intermediate" | "senior" | "executive"> = {
        "entry-level": "entry",
        "mid-level": "intermediate",
        "senior-level": "senior",
        "executive-level": "executive"
    };

    // Process skills data to be an array of objects
    const processedSkills = formData.skills_required.map(skillItem => ({
        _id: skillItem.skill._id,
        name: skillItem.skill.name,
        importance: skillItem.importance
    }));

    return {
        company: formData.company_id || '',
        title: formData.title,
        description: formData.description,
        job_type: formData.job_type as "full-time" | "part-time" | "contract" | "internship",
        experience_level: experienceLevelMap[formData.experience_level] || "intermediate",
        location: formData.location,
        work_place_type: formData.work_place_type as "remote" | "hybrid" | "on-site",
        salary_range: {
            min: 0, // Add these fields to your form if needed
            max: 0,
            currency: "USD"
        },
        skills_required: processedSkills,
        screening_questions: formData.screening_questions,
        interview_questions: formData.interview_questions,
        status: "active"
    };
};

interface UpdateJobPayload extends Partial<CreateJobPayload> {}

interface SearchJobsParams {
    keyword?: string;
    work_place_type?: "remote" | "hybrid" | "on-site";
    location?: string;
    experience_level?: "entry" | "intermediate" | "senior" | "executive";
    job_type?: "full-time" | "part-time" | "contract" | "internship";
    skills?: string; // Comma-separated list of skills
    min_salary?: number;
    max_salary?: number;
    currency?: string;
    page?: number;
    limit?: number;
}

interface GetMatchingCandidatesParams {
    job_id?: string;
    skills_required?: string[];
    importance_level?: string;
  }

interface GetSkillSuggestionsParams{
    jobTitle:string;
    jobDescription:string;
}

interface SkillSuggestionsResponse {
    success: boolean;
    data: AIRecommendedSkill[];
}

export interface AIRecommendedSkill {
    skill: Skill;
    importance: "Very Important" | "Important" | "Good-To-Have";
    reasoning: string;
}
  

// API Slice for Jobs
export const employerJobsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create job posting
        createJobPosting: builder.mutation<JobResponse, CreateJobPayload>({
            query: (data) => ({
                url: "/api/v1/employerJobs/jobs",
                method: "POST",
                body: data
            }),
        }),

        // Update job
        updateJob: builder.mutation<JobResponse, { id: string; data: UpdateJobPayload }>({
            query: ({ id, data }) => ({
                url: `/api/v1/employerJobs/jobs/${id}`,
                method: "PUT",
                body: data
            }),
        }),

        // Delete job
        deleteJob: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/api/v1/employerJobs/jobs/${id}`,
                method: "DELETE"
            }),
        }),

        // Get company jobs
        getCompanyJobs: builder.query<JobsListResponse, { company_id: string;}>({
            query: ({ company_id}) => ({
                url: `/api/v1/employerJobs/company/${company_id}/jobs`,
                method: "GET",
            }),
        }),

        // Get employer jobs
        getEmployerJobs: builder.query<JobsListResponse, { employer_id: string;}>({
            query: ({ employer_id}) => ({
                url: `/api/v1/employerJobs/employer/${employer_id}/jobs`,
                method: "GET",
            }),
        }),

        // Get manageable jobs for an employer
        getManageableJobs: builder.query<JobsListResponse, { employer_id: string;}>({
            query: ({ employer_id}) => ({
                url: `/api/v1/employerJobs/employer/${employer_id}/manageable-jobs`,
                method: "GET",
            }),
        }),

        // Search jobs
        searchJobs: builder.query<JobsListResponse, SearchJobsParams>({
            query: (params) => ({
                url: `/api/v1/employerJobs/jobs/search`,
                method: "GET",
                params
            })
        }),

        // Get company candidates
        getCompanyCandidates: builder.query<CandidatesResponse, { company_id: string | undefined; job_id?: string | undefined }>({
            query: ({ company_id, job_id }) => ({
                url: `/api/v1/employerJobs/company/${company_id}`,
                method: "GET",
                params: job_id ? { job_id } : {}
            }),
        }),

        // Get matching candidates
        getMatchingCandidates: builder.query<MatchedCandidatesResponse, GetMatchingCandidatesParams>({
            query: (params) => {
              // Create query params
              const queryParams = new URLSearchParams();
              if (params.job_id) {
                queryParams.append('job_id', params.job_id);
              }
              
              return {
                url: `api/v1/employerJobs/matching?${queryParams.toString()}`,
                method: "GET"
              };
            },
          }),

        // Get job details
        getJobDetails: builder.query<JobResponse, string>({
            query: (id) => ({
                url: `/api/v1/employerJobs/jobs/${id}`,
                method: "GET"
            }),
        }),
        getEmployerSkillSuggestions: builder.mutation<SkillSuggestionsResponse, GetSkillSuggestionsParams>({
            query: (params) => ({
                url: `/api/v1/employerJobs/getSuggestedSkills`,
                method: "POST",
                body: params
            }),
        }),
        getInterviewQuestions: builder.mutation({
            query: (data) => ({
              url: '/api/v1/employerJobs/interview-questions',
              method: 'POST',
              body: data,
            }),
          }),
    }),
    overrideExisting: false
});

// Export hooks
export const {
    useCreateJobPostingMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
    useGetCompanyJobsQuery,
    useGetEmployerJobsQuery,
    useGetCompanyCandidatesQuery,
    useGetManageableJobsQuery,
    useSearchJobsQuery,
    useGetMatchingCandidatesQuery,
    useGetJobDetailsQuery,
    useGetEmployerSkillSuggestionsMutation,
    useGetInterviewQuestionsMutation
} = employerJobsApiSlice;