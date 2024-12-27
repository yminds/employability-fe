import { apiSlice } from "./apiSlice";

export const experienceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperiencesByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_experience/user/${id}`,  // Endpoint with userId in URL
        method: "GET",
      }),
    }),
    // ... add other endpoints here if needed (e.g., create, update, delete)
  }),
});

export const { useGetExperiencesByUserIdQuery } = experienceApiSlice;
