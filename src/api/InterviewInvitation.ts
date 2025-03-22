import { apiSlice } from "./apiSlice";
import { Job } from "./employerJobsApiSlice";

// Interface definitions
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
    interview_type: 'full' | 'screening';
  };
  status: 'pending' | 'accepted' | 'completed' | 'declined' | 'expired';
  sent_at: string;
  updated_at: string;
  report_id?: string;
  shortlist: boolean;
}

// New interface for interview candidates
export interface InterviewCandidate {
  _id: string;
  job_id: string;
  candidate_id: string;
  user_id?: string;
  candidate_name: string;
  candidate_email: string;
  candidate_location?: string;
  profile_image?: string;
  status: string;
  task: {
    interview_type: 'full' | 'screening';
  };
  has_report: boolean;
  report_id?: string;
  interview_score?: number;
  report_submitted_at?: string;
  sent_at: string;
  updated_at: string;
  source: 'candidate_db' | 'user_db';
  shortlist: boolean;
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
      status: 'success' | 'failed';
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

// Request Payload Interfaces
interface SendInvitationsPayload {
  job_id: string;
  candidate_ids: string[];
  interview_type: 'full' | 'screening';
  application_deadline: string | Date;
}

interface UpdateStatusPayload {
  inviteId: string;
  status: 'accepted' | 'declined';
}

interface GetJobInvitesParams {
  jobId: string;
  status?: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface GetInterviewCandidatesParams {
  jobId: string;
  interviewType?: 'full' | 'screening' | 'all';
  status?: 'submitted' | 'pending' | 'all';
  sortBy?: 'recent' | 'oldest' | 'name';
}

interface ShortlistCandidateParams {
  jobId: string;
  candidateId: string;
}

export interface UserExistsRequest {
  email: string;
}

export interface UserExistsResponse {
  exists: boolean;
  userId?: string;
  candidateId?: string;
  source?: 'user_db' | 'candidate_db' | null;
}

// API Slice for Interview Invitations
export const interviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send interview invitations to candidates
    sendInterviewInvitations: builder.mutation<InviteBatchResponse, SendInvitationsPayload>({
      query: (data) => ({
        url: "/api/v1/employerInterviewInvitation/invite",
        method: "POST",
        body: data
      }),
    }),
    
    // Get progress of a sending batch
    getInviteProgress: builder.query<InviteProgressResponse, string>({
      query: (batchId) => ({ 
        url: `/api/v1/employerInterviewInvitation/invite/progress/${batchId}` 
      }),
    }),
    
    // Get all invites for a specific job
    getJobInvites: builder.query<InterviewInvitesListResponse, GetJobInvitesParams>({
      query: ({ jobId, status }) => ({
        url: `/api/v1/employerInterviewInvitation/job/${jobId}`,
        params: status ? { status } : undefined
      }),

    }),
    
    // Get all invites for the current candidate
    getCandidateInvites: builder.query<InterviewInvitesListResponse, void>({
      query: () => ({ 
        url: `/api/v1/employerInterviewInvitation/candidate` 
      }),
    }),
    
    // Update an invitation status (accept/decline)
    updateInviteStatus: builder.mutation<InterviewInviteResponse, UpdateStatusPayload>({
      query: ({ inviteId, status }) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/status`,
        method: 'PUT',
        body: { status }
      }),
    }),
    
    // Resend an invitation
    resendInvite: builder.mutation<InterviewInviteResponse, string>({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/resend`,
        method: 'POST'
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
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/check` 
      }),
    }),
    
    // Check invitation status
    checkInviteStatus: builder.query<ExpiryStatusResponse, string>({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/check-status`,
        method: "GET",
      }),
    }),

    // Submit a response to an invite (public endpoint)
    respondToInvite: builder.mutation<InterviewInviteResponse, { inviteId: string, action: 'accept' | 'decline' }>({
      query: ({ inviteId, action }) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/response`,
        method: "POST",
        body: { action },
      }),
    }),
    
    // Get invites for a specific user
    getInvitesByUserId: builder.query<InterviewInvitesListResponse, string>({
      query: (userId) => ({
        url: `/api/v1/employerInterviewInvitation/invite/user/${userId}`,
      }),
    }),
    
    // New endpoints for interview candidates functionality
    getInterviewCandidates: builder.query<InterviewCandidatesResponse, GetInterviewCandidatesParams>({
      query: ({ jobId, interviewType, status, sortBy }) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/interview-candidates`,
        params: {
          interview_type: interviewType,
          status,
          sort_by: sortBy
        }
      }),
    }),
    
    // Get interview statistics for a job
    getInterviewStats: builder.query<InterviewStatsResponse, string>({
      query: (jobId) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/interview-stats`,
      }),
    }),
    
    // Shortlist a candidate
    shortlistCandidate: builder.mutation<ShortlistResponse, ShortlistCandidateParams>({
      query: ({ jobId, candidateId }) => ({
        url: `/api/v1/employerInterviewInvitation/jobs/${jobId}/shortlist`,
        method: 'POST',
        body: { candidate_id: candidateId }
      }),
    }),
  }),
  overrideExisting: false
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
  useShortlistCandidateMutation
} = interviewApiSlice;