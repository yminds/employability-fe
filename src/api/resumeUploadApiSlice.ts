import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use the environment variable for the base URL
const baseUrl = process.env.VITE_API_BASE_URL as string;

export const resumeUploadApiSlice = createApi({
  reducerPath: "resumeApi", // Unique key for this API service
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl, // Use the environment variable as the base URL
    // You can also add default headers or credentials if needed
  }),
  endpoints: (builder) => ({
    uploadResume: builder.mutation({
      query: ({ file, userId }) => {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", userId);

        return {
          url: "resume/upload-resume", // Specify the endpoint
          method: "POST",
          body: formData,
        };
      },
    }),
    // Add more endpoints as needed

    bulkUploadResumes: builder.mutation({
      query: ({ files }) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          const element = files[i];
          formData.append("resumes", element);
        }
        formData.append("name", "dilshad");
        return {
          url: "/api/v1/resume/bulkUpload-resumes",
          method: "POST",
          body: formData,
        };
      },
      // invalidatesTags: ["Resumes" as any]
    }),

    getResumesParsedStatus: builder.query({
      query: (uploadId) => ({
        url: `/api/v1/resume/upload-status/${uploadId}`,
        method: "GET",
      }),
      keepUnusedDataFor:0
    }),
    getAllResumes: builder.query({
      query: () => ({
        url: `/api/v1/resume/getAll-resumes`,
        method: "GET",
      }),
      keepUnusedDataFor:0
    }),
  }),
});

export const { useUploadResumeMutation, useBulkUploadResumesMutation,useGetResumesParsedStatusQuery,useGetAllResumesQuery } =
  resumeUploadApiSlice;
