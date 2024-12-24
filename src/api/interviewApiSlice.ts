import { apiSlice } from "./apiSlice";
import { Interview } from "./models/interview";

export const interviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInterview: builder.mutation({
      query: (data: Interview) => ({
        url: "/api/v1/interview/create",
        method: "POST",
        body: { ...data },
      }),
    }),
  }),
});

export const { useCreateInterviewMutation } = interviewApiSlice;
