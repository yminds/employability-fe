import { apiSlice } from "./apiSlice";

export const interviewInvitesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvitesByUserId: builder.query({
      query: (userId: string | undefined) => ({
        url: `/api/v1/employerInterviewInvitation/invite/user/${userId}`,
        method: "GET",
      }),
      providesTags: ['InterviewInvites'],
    }),
    
    respondToInvite: builder.mutation({
      query: ({ inviteId, action }) => ({
        url: `/api/v1/employerInterviewInvitation/${inviteId}/response`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: ['InterviewInvites'],
    }),
    
    getInviteDetails: builder.query({
      query: (inviteId: string) => ({
        url: `/api/interview-invites/${inviteId}`,
        method: "GET",
      })
    }),
    // Get fundamentals names as CSV by skill pool IDs
    getFundamentalNamesAsCsv: builder.mutation<{data:string}, string[]>({
      query: (skill_pool_ids) => ({
        url: '/api/v1/fundamentals/getNamesAsCsv',
        method: 'POST',
        body: { skill_pool_ids },
      }),
    }),
    updateInterviewId: builder.mutation({
      query: ({ inviteId, interviewId, type }) => ({
        url: `/api/v1/employerInterviewInvitation/invite/${inviteId}`,
        method: "POST",
        body: { interviewId, type },
      }),
      invalidatesTags: ['InterviewInvites'],
    }),
    shortlist: builder.mutation({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/shortlist/${inviteId}`,
        method: "PATCH",
      }),
    }),
    getShortlistStatus: builder.query({
      query: (inviteId) => ({
        url: `/api/v1/employerInterviewInvitation/shortlist/status/${inviteId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useGetInvitesByUserIdQuery,
  useRespondToInviteMutation,
  useGetInviteDetailsQuery,
  useGetFundamentalNamesAsCsvMutation,
  useUpdateInterviewIdMutation,
  useShortlistMutation,
  useGetShortlistStatusQuery,
} = interviewInvitesApiSlice; 