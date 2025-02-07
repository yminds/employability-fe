import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/user/update/${userId}`,
        method: "PUT",
        body: data,
      }),
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
  }),
  overrideExisting: false,
});

export const { 
  useUpdateUserMutation,
  useGetUserDetailsQuery
} = userApi;