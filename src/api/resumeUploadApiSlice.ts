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
          url: "/api/v1/resume/upload-resume", // Specify the endpoint
          method: "POST",
          body: formData,
        };
      },
    }),
    // Add more endpoints as needed
  }),
  
});

export const { useUploadResumeMutation } = resumeUploadApiSlice;
