import { apiSlice } from "./apiSlice";

export const employabilityJobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCandidateJobs: builder.mutation({
      query: (params) => ({
        url: "/api/v1/employability-jobs/jobs",
        method: "GET",
        params: params || {},
      }),
    }),

    getJobById: builder.query({
      query: (jobId) => ({
        url: `/api/v1/employability-jobs/jobs/${jobId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCandidateJobsMutation, useGetJobByIdQuery } =
  employabilityJobApiSlice;
