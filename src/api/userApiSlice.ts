import { apiSlice } from "./apiSlice"

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
  }),
  overrideExisting: false,
})

export const { useUpdateUserMutation, useGetUserDetailsQuery, useGetUserByIdQuery } = userApi

