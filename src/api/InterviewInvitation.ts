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
  application_deadline: string;
  task: {
    interview_type: 'full' | 'screening';
  };
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at: string;
  updated_at: string;
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
  };
}

interface InviteProgressResponse {
  success: boolean;
  data: {
    total: number;
    completed: number;
    failed: number;
  };
}

interface ExpiryStatusResponse {
  success: boolean;
  data: {
    isExpired: boolean;
    status: string;
    deadline: string;
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

export interface UserExistsRequest {
  email: string;
}

export interface UserExistsResponse {
  exists: boolean;
  userId?: string;
  source?: 'user_db' | 'candidate_db' | 'both';
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
      query: (batchId) => ({ url: `/api/v1/employerInterviewInvitation/invite/progress/${batchId}` }),
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
      query: () => ({ url: `/api/v1/employerInterviewInvitation/candidate` }),
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

    checkUserExists: builder.mutation<UserExistsResponse, UserExistsRequest>({
      query: (data) => ({
        url: `/api/v1/employerInterviewInvitation/users/exists`,
        method: "POST",
        body: data,
      }),
    }),

    
    // Check if an invitation has expired
    checkInviteExpiry: builder.query<ExpiryStatusResponse, string>({
      query: (inviteId) => ({ url: `/api/v1/employerInterviewInvitation/invite/${inviteId}/check` }),
    }),
    checkInviteStatus: builder.query({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/check-status`,
        method: "GET",
      }),
    }),

    // Submit a response to an invite (public endpoint)
    respondToInvite: builder.mutation({
      query: ({ inviteId, action }) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/response`,
        method: "POST",
        body: { action },
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
  useCheckUserExistsMutation  
} = interviewApiSlice;