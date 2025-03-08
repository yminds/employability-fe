import { apiSlice } from "./apiSlice";
import { Job } from "./employerJobsApiSlice";


export interface Candidate {
  _id: string;
  name: string;
  email: string;
}

// ScreeningCard interface based on your Mongoose model
export interface ScreeningCard {
  _id: string;
  job_id: string | Job;
  candidate_id: string | Candidate;
  status: "passed" | "failed";
  matching_score: number;
  reason: string;
  invite_status: "not_invited" | "invited";
  invite_date: string | null;
  createdAt: string;
  updatedAt: string;
}

// Response Interfaces
interface ScreeningCardResponse {
  success: boolean;
  data: ScreeningCard;
}

interface ScreeningCardsListResponse {
  success: boolean;
  data: ScreeningCard[];
  total: number;
  page: number;
  limit: number;
}

interface ScreeningProgressResponse {
  success: boolean;
  data: {
    total_candidates: number;
    screened_candidates: number;
    passed_candidates: number;
    failed_candidates: number;
    progress_percentage: number;
    status: "in_progress" | "completed";
  };
}

interface BatchScreeningResponse {
  success: boolean;
  message: string;
  data: {
    batch_id: string;
    job_id: string;
    total_candidates: number;
    started_at: string;
  };
}

// Request Payload Interfaces
interface ScreenCandidatesPayload {
  job_id: string;
  candidate_ids: string[];
}

interface GetScreeningResultsParams {
  job_id?: string;
  status?: "passed" | "failed";
  min_score?: number;
  max_score?: number;
  invite_status?: "not_invited" | "invited";
  page?: number;
  limit?: number;
}

// API Slice for Screening Cards
export const screeningCardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Screen candidates for a job
    screenCandidates: builder.mutation<BatchScreeningResponse, ScreenCandidatesPayload>({
      query: (data) => ({
        url: "/api/v1/employerScreeening/screen",
        method: "POST",
        body: data,
      }),
    }),

    // Get screening progress
    getScreeningProgress: builder.query<ScreeningProgressResponse, string>({
      query: (batch_id) => ({
        url: `/api/v1/employerScreeening/progress/${batch_id}`,
        method: "GET",
      }),
    }),

    // Get screening results
    getScreeningResults: builder.query<ScreeningCardsListResponse, GetScreeningResultsParams>({
      query: (params) => ({
        url: `/api/v1/employerScreeening/results`,
        method: "GET",
        params,
      }),
      
    }),

    // Get candidate screening details
    getCandidateScreeningDetails: builder.query<
      ScreeningCardResponse,
      { job_id: string; candidate_id: string }
    >({
      query: ({ job_id, candidate_id }) => ({
        url: `/api/v1/employerScreeening/details/${job_id}/${candidate_id}`,
        method: "GET",
      }),
    }),

    // Update invite status (additional useful endpoint)
    updateInviteStatus: builder.mutation<
      ScreeningCardResponse,
      { id: string; invite_status: "not_invited" | "invited" }
    >({
      query: ({ id, invite_status }) => ({
        url: `/api/v1/employerScreeening/${id}/invite`,
        method: "PATCH",
        body: { invite_status },
      }),
    }),
  }),
  overrideExisting:false
});

// Export hooks
export const {
  useScreenCandidatesMutation,
  useGetScreeningProgressQuery,
  useGetScreeningResultsQuery,
  useGetCandidateScreeningDetailsQuery,
  useUpdateInviteStatusMutation,
} = screeningCardApiSlice;