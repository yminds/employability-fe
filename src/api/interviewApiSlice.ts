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
  }),
});

export const { useCreateInterviewMutation, useGetInterviewbyIdQuery } =
  interviewApiSlice;
