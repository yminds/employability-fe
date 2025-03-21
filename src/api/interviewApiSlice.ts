import { apiSlice } from "./apiSlice";
import { Interview } from "@/models/Interview";

export const interviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInterview: builder.mutation({
      query: (data: Interview) => ({
        url: "/api/v1/interview/create",
        method: "POST",
        body: { ...data },
      }),
    }),
    getInterviewbyId: builder.query({
      query: (id: string) => ({
        url: `/api/v1/interview/${id}`,
        method: "GET",
      }),
    }),
    getAllUserInterviews: builder.query({
      query: (user_id) => ({
        url: `/api/v1/interview/user/${user_id}`,
        method: "GET",
      }),
    }),
    getInvitesByUserId: builder.query({
      query: (userId: string | undefined) => ({
        url: `/api/v1/employerInterviewInvitation/invite/user/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateInterviewMutation, useGetInterviewbyIdQuery, useGetAllUserInterviewsQuery, useGetInvitesByUserIdQuery } =
  interviewApiSlice;
