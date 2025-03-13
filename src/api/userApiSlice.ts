import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/user/update/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `/api/v1/user/getUserDetails/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["User", "Experience", "Education", "Certification"],
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `/api/v1/user/getUserById/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["User", "Experience", "Education", "Certification"],
    }),
    getUserVerifiedContent: builder.query({
      query: (username) => ({
        url: `/api/v1/user/verified-content/${username}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["VerifiedContent"]
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetUserByIdQuery,
  useGetUserVerifiedContentQuery,
} = userApi;
