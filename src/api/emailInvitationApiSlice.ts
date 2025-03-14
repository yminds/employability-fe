import { apiSlice } from "./apiSlice";
import { Job } from "./employerJobsApiSlice";
import { ScreeningCard } from "./matchingCardApi";

// Company interface (if not already defined elsewhere)
export interface Company {
  _id: string;
  name: string;
  website: string;
}

// Enhanced Job interface with populated company
export interface JobWithCompany extends Omit<Job, 'company'> {
  company_id: Company;
}

// Response Interfaces
interface InvitationResponse {
  success: boolean;
  message: string;
  data: {
    batch_id: string;
    total_candidates: number;
  };
}

interface InvitationProgressResponse {
  success: boolean;
  data: {
    total: number;
    completed: number;
    failed: number;
    isComplete: boolean;
  };
}

interface InvitationStatusesResponse {
  success: boolean;
  results: number;
  data: Array<ScreeningCard & {
    candidate_id: {
      _id: string;
      name: string;
      contact: {
        email: string;
      };
      role: string;
      experience_level: string;
    }
  }>;
}

interface TokenValidationResponse {
  success: boolean;
  data?: {
    userExists: boolean;
    candidateId: string;
    redirectTo: string;
  };
  message?: string;
}

interface CandidateInvitationsResponse {
  success: boolean;
  results: number;
  data: Array<ScreeningCard & {
    job_id: JobWithCompany;
  }>;
}

// Request Payload Interfaces
interface InviteCandidatesPayload {
  job_id: string;
  candidate_ids: string[];
  message?: string;
  email_type?: 'interview_invitation' | 'job_notification';
  employer_id: string;
}

interface ResendInvitationPayload {
  job_id: string;
  candidate_id: string;
  message?: string;
  employer_id: string;
}

// API Slice for Email Invitations
export const emailInvitationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Invite candidates
    inviteCandidates: builder.mutation<InvitationResponse, InviteCandidatesPayload>({
      query: (data) => ({
        url: "/api/v1/employerInterview/invite",
        method: "POST",
        body: data,
      }),
    }),

    // Get invitation progress
    getInvitationProgress: builder.query<InvitationProgressResponse, string>({
      query: (batch_id) => ({
        url: `/api/v1/employerInterview/progress/${batch_id}`,
        method: "GET",
      }),
    }),

    // Get invitation statuses for a job
    getInvitationStatuses: builder.query<
      InvitationStatusesResponse,
      { job_id: string; employer_id: string }
    >({
      query: ({ job_id, employer_id }) => ({
        url: `/api/v1/employerInterview/statuses`,
        method: "GET",
        params: { job_id, employer_id },
      }),
    }),

    // Validate application token
    validateApplicationToken: builder.query<
      TokenValidationResponse,
      { job_id: string; email: string; token: string }
    >({
      query: (params) => ({
        url: `/api/v1/employerInterview/validate-token`,
        method: "GET",
        params,
      }),
    }),

    // Resend invitation
    resendInvitation: builder.mutation<InvitationResponse, ResendInvitationPayload>({
      query: (data) => ({
        url: `/api/v1/employerInterview/resend`,
        method: "POST",
        body: data,
      }),
    }),

    // Get candidate invitations
    getCandidateInvitations: builder.query<CandidateInvitationsResponse, string>({
      query: (candidate_id) => ({
        url: `/api/v1/employerInterview/candidate/${candidate_id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting:false
});

// Export hooks
export const {
  useInviteCandidatesMutation,
  useGetInvitationProgressQuery,
  useGetInvitationStatusesQuery,
  useLazyValidateApplicationTokenQuery,
  useResendInvitationMutation,
  useGetCandidateInvitationsQuery,
} = emailInvitationApiSlice;