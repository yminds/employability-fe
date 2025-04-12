import { apiSlice } from "./apiSlice";

export const candidatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCandidateDetails: builder.query({
      query: (candidateId) => ({
        url: `/api/v1/resumes/candidate/${candidateId}`,
        method: "GET"
      }),
    }),
  }),
});

export const { useGetCandidateDetailsQuery } = candidatesApiSlice;