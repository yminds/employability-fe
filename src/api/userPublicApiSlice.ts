import { apiSlice } from "./apiSlice";

export const userPublicApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProfile: builder.query({
      query: ({ username }) => ({
        url: `/api/v1/user-profile/profile/${username}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPublicProfileQuery } = userPublicApiSlice;
