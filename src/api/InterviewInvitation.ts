import { apiSlice } from "./apiSlice";
import { Job } from "./employerJobsApiSlice";


export interface Candidate {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  profile_image?: string;
}

export interface InterviewInvite {
  _id: string;
  job_id: string | Job;
  candidate_id: string | Candidate;
  user_id?: string;
  application_deadline: string;
  task: {
    interview_type: "full" | "screening";
  };
  status: "pending" | "accepted" | "completed" | "declined" | "expired";
  sent_at: string;
  updated_at: string;
  interview_id?: string; 
  shortlist: boolean;
}


export interface InterviewCandidate {
  _id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_location?: string;
  profile_image?: string;
  status: "pending" | "accepted" | "completed" | "declined" | "expired";
  shortlist: boolean;
  interview_id?: string;
  has_report: boolean;
  report_id?: string;
  final_rating?: number;
  report_updated_at?: string;
  type_report_id?: string;
  total_experience?:number;
  type_final_rating?: number;
  type_report_updated_at?: string;
  effective_report_id?: string;
  effective_final_rating?: number;
  effective_report_updated_at?: string;
  updated_at?: string;
  sent_at: string;
  submission_expected_date?: string;
  submission_date?: string;
  task: {
    interview_type: {
      type: "full" | "screening";
      status: "completed" | "incomplete";
      estimated_time: number;
      interview_id?: string;
    };
    skills: {
      _id: string;
      name: string;
      status: "completed" | "incomplete";
      estimated_time: number;
      interview_id?: string;
    }[];
  };
  skill_interviews?: {
    skill_id: string;
    skill_name: string;
    skill_status: "completed" | "incomplete";
    interview_id?: string;
    interview_details?: any;
    report_details?: any;
  }[];
  interview_info?: {
    interview_id: string;
    interview_date?: string;
    interview_status?: string;
  };
  type_interview_info?: {
    interview_id: string;
    interview_date?: string;
    interview_status?: string;
  };
  has_interview_in_type: boolean;
}

// Report interface based on the schema
export interface Report {
  _id: string;
  interview_id: string;
  summary: {
    text: string;
    strengths: string[];
    improvements: string[];
    performance_highlights: Array<{
      criteria: string;
      rating: number;
    }>;
    technicalSkills?: {
      score?: number;
      strengths?: string[];
      areasForImprovement?: string[];
    };
    problemSolvingSkills?: {
      score?: number;
      strengths?: string[];
      areasForImprovement?: string[];
    };
    softskills?: {
      score?: number;
      strengths?: string[];
      areasForImprovement?: string[];
    };
  };
  concept_ratings: Array<{
    reason: string;
    concept: string;
    rating: number;
    skill?: string;
  }>;
  final_rating: number;
  specificQuestions?: Array<{
    question: string;
    response: string;
  }>;
  interview_phase?: Array<{
    phase: string;
    reason: string;
    rating: number;
  }>;
}

export interface InterviewStats {
  fullInterviews: {
    invitesSent: number;
    accepted: number;
    notAccepted: number;
    submitted: number;
  };
  screeningInterviews: {
    invitesSent: number;
    accepted: number;
    notAccepted: number;
    submitted: number;
  };
}

// Response Interfaces
interface InterviewInviteResponse {
  success: boolean;
  message?: string;
  data: InterviewInvite;
}

interface InterviewInvitesListResponse {
  success: boolean;
  count: number;
  data: InterviewInvite[];
}

interface InviteBatchResponse {
  success: boolean;
  message: string;
  data: {
    batch_id: string;
    candidates_count: number;
    validation_details?: Array<{
      id: string;
      in_candidate_db: boolean;
      in_user_db: boolean;
    }>;
  };
}

interface InviteProgressResponse {
  success: boolean;
  data: {
    total: number;
    processed: number;
    successful: number;
    failed: number;
    details: Array<{
      id: string;
      status: "success" | "failed";
      error?: string;
    }>;
  };
}

interface ExpiryStatusResponse {
  success: boolean;
  data: {
    isExpired: boolean;
    status: string;
    deadline: string;
    jobDetails: any;
    interviewType: string;
    candidateInfo: any;
    source: string;
    task: any;
  };
}

interface InterviewCandidatesResponse {
  success: boolean;
  count: number;
  data: InterviewCandidate[];
  stats: InterviewStats;
}

interface InterviewStatsResponse {
  success: boolean;
  data: InterviewStats;
}

interface ShortlistResponse {
  success: boolean;
  message: string;
  data: {
    invitation_id: string;
    job_id: string;
    candidate_id: string;
    shortlisted: boolean;
  };
}

// New interface for report response
interface ReportResponse {
  success: boolean;
  data: Report;
}

// Request Payload Interfaces
interface SendInvitationsPayload {
  job_id: string;
  candidate_ids: string[];
  interview_type: "full" | "screening";
  application_deadline: string | Date;
}

interface UpdateStatusPayload {
  inviteId: string;
  status: "accepted" | "declined" | "completed";
}

interface GetJobInvitesParams {
  jobId: string;
  status?: "pending" | "accepted" | "completed" | "declined" | "expired";
}

interface GetInterviewCandidatesParams {
  jobId: string;
  interviewType?: "full" | "screening" | "all";
  status?: "completed" | "pending" | "all";
  sortBy?: "recent" | "oldest" | "name" | "rating_desc" | "rating_asc";
  filterStatus: string[] | string;
  interviewScore: number;
  workExperience?: number;
  locations?: string;
}

interface ShortlistCandidateParams {
  jobId: string;
  candidateId: string;
}

export interface UserExistsRequest {
  email: string;
  inviteId:string;
}

export interface UserExistsResponse {
  exists: boolean;
  userId?: string;
  candidateId?: string;
  source?: "user_db" | "candidate_db" | null;
}

interface SendInvitationResponseMailPayload {
  inviteId: string;
  candidateEmail: string;
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
  status: "accepted" | "declined";
  submissionDate?: string;
}

interface SendInvitationResponseMailResponse {
  success: boolean;
  message: string;
}

// API Slice for Interview Invitations
export const interviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send interview invitations to candidates
    sendInterviewInvitations: builder.mutation<
      InviteBatchResponse,
      SendInvitationsPayload
    >({
      query: (data) => ({
        url: "/api/v1/employerInterviewInvitation/invite",
        method: "POST",
        body: data,
      }),
    }),

    // Get progress of a sending batch
    getInviteProgress: builder.query<InviteProgressResponse, string>({
      query: (batchId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/progress/${batchId}`,
      }),
    }),

    // Get all invites for a specific job
    getJobInvites: builder.query<
      InterviewInvitesListResponse,
      GetJobInvitesParams
    >({
      query: ({ jobId, status }) => ({
        url: `/api/v1/employerInterviewInvitation/job/${jobId}`,
        params: status ? { status } : undefined,
      }),
    }),

    // Get all invites for the current candidate
    getCandidateInvites: builder.query<InterviewInvitesListResponse, void>({
      query: () => ({
        url: `/api/v1/employerInterviewInvitation/candidate`,
      }),
    }),

    // Update an invitation status (accept/decline)
    updateInviteStatus: builder.mutation<
      InterviewInviteResponse,
      UpdateStatusPayload
    >({
      query: ({ inviteId, status }) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    // Resend an invitation
    resendInvite: builder.mutation<InterviewInviteResponse, string>({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/resend`,
        method: "POST",
      }),
    }),

    // Check if a user exists
    checkUserExists: builder.mutation<UserExistsResponse, UserExistsRequest>({
      query: (data) => ({
        url: `/api/v1/employerInterviewInvitation/users/exists`,
        method: "POST",
        body: data,
      }),
    }),

    // Check if an invitation has expired
    checkInviteExpiry: builder.query<ExpiryStatusResponse, string>({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/check`,
      }),
    }),

    // Check invitation status
    checkInviteStatus: builder.query<ExpiryStatusResponse, string>({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/check-status`,
        method: "GET",
      }),
      providesTags: ["InterviewStatus"],
    }),

    // Submit a response to an invite (public endpoint)
    respondToInvite: builder.mutation<
      InterviewInviteResponse,
      {
        inviteId: string;
        action: "accept" | "decline";
        submission_expected_date?: string;
      }
    >({
      query: ({ inviteId, action, submission_expected_date }) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/response`,
        method: "POST",
        body: { action, submission_expected_date },
      }),
      invalidatesTags: ["InterviewStatus"],
    }),

    // Get invites for a specific user
    getInvitesByUserId: builder.query<InterviewInvitesListResponse, string>({
      query: (userId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/user/${userId}`,
      }),
    }),

    // New endpoints for interview candidates functionality
    getInterviewCandidates: builder.query<
      InterviewCandidatesResponse,
      GetInterviewCandidatesParams
    >({
      query: ({ jobId, interviewType, status, sortBy }) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/interview-candidates`,
        params: {
          interview_type: interviewType,
          status,
          sort_by: sortBy,
        },
      }),
    }),

    // Get interview statistics for a job
    getInterviewStats: builder.query<InterviewStatsResponse, string>({
      query: (jobId) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/interview-stats`,
      }),
    }),

    // Shortlist a candidate
    shortlistCandidate: builder.mutation<
      ShortlistResponse,
      ShortlistCandidateParams
    >({
      query: ({ jobId, candidateId }) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/shortlist`,
        method: "POST",
        body: { candidate_id: candidateId },
      }),
    }),

    sendInvitationResponseMail: builder.mutation<
      SendInvitationResponseMailResponse,
      SendInvitationResponseMailPayload
    >({
      query: (data) => ({
        url: `/api/v1/employerInterviewInvitation/send-response-mail`,
        method: "POST",
        body: data,
      }),
    }),
    getShortlistedCandiates:builder.query({
      query:({jobId,sortBy = 'recent'})=>({
        url:`/api/v1/employerInterviewInvitation/jobs/${jobId}/shortlisted-candidates`,
        method:"GET",
        params: { sortBy }
      }),
      transformResponse:(response)=>{
        return response;
      }
    })
  }),
  overrideExisting: false,
});

// Export the auto-generated hooks
export const {
  useSendInterviewInvitationsMutation,
  useGetInviteProgressQuery,
  useGetJobInvitesQuery,
  useGetCandidateInvitesQuery,
  useUpdateInviteStatusMutation,
  useResendInviteMutation,
  useCheckInviteExpiryQuery,
  useLazyCheckInviteExpiryQuery,
  useCheckInviteStatusQuery,
  useRespondToInviteMutation,
  useCheckUserExistsMutation,
  useGetInvitesByUserIdQuery,
  useGetInterviewCandidatesQuery,
  useGetInterviewStatsQuery,
  useShortlistCandidateMutation,
  useSendInvitationResponseMailMutation,
  useGetShortlistedCandiatesQuery
} = interviewApiSlice;
