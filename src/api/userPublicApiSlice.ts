import { apiSlice } from "./apiSlice";

export const userPublicApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProfile: builder.query({
      query: ({ username }) => ({
        url: `/api/v1/user-profile/profile/${username}`,
        method: "GET",
      }),
    }),
    getPublicUserSkillSummary: builder.mutation({
      query: ({ username }) => ({
        url: `/api/v1/user-profile/skill-summary`,
        method: "POST",
        body: { username },
      }),
    }),
    getPublicProfileViewCount: builder.mutation({
      query: ({ username }) => ({
        url: `/api/v1/user-profile/view-count`,
        method: "POST",
        body: { username },
      }),
    }),
  }),
});

export const {
  useGetPublicProfileQuery,
  useGetPublicUserSkillSummaryMutation,
  useGetPublicProfileViewCountMutation,
} = userPublicApiSlice;
