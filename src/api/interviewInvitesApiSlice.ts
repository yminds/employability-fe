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
  }),
});

export const { 
  useGetInvitesByUserIdQuery,
  useRespondToInviteMutation,
  useGetInviteDetailsQuery
} = interviewInvitesApiSlice; 