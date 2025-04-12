import { apiSlice } from "./apiSlice";

export const resumeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadCandidateResume: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/resume/upload-candidate-resume",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    updateCandidate: builder.mutation({
      query: ({ candidateId, candidateData }) => ({
        url: `/api/v1/resume/${candidateId}`,
        method: "PATCH",
        body: candidateData,
      }),
    }),
  }),
});

export const screeningResponseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createScreeningResponse: builder.mutation({
      query: (screeningData) => ({
        url: "/api/v1/screeningResponse/screening-responses",
        method: "POST",
        body: screeningData,
      }),
    }),
  }),
});

export const { useUploadCandidateResumeMutation, useUpdateCandidateMutation } = resumeApiSlice;
export const { useCreateScreeningResponseMutation } = screeningResponseApiSlice;