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

    saveJobToUser: builder.mutation({
      query: ({ userId, jobId, resume_url }) => ({
        url: `/api/v1/employability-jobs/jobs/save_job/${userId}`,
        method: "POST",
        body: { jobId, resume_url },
      }),
    }),
  }),
});

export const {
  useGetAllCandidateJobsMutation,
  useGetJobByIdQuery,
  useSaveJobToUserMutation,
} = employabilityJobApiSlice;
