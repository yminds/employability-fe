import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.VITE_API_BASE_URL as string;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/user/update/${userId}`,
        method: "PUT", // Using PUT method
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
