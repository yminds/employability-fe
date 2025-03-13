import { apiSlice } from "./apiSlice";

export const featuredInterviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFeaturedInterview: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/featured-interview/add/${userId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FeaturedInterview"],
    }),
    updateFeaturedInterview: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/featured-interview/update/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FeaturedInterview"],
    }),
    getFeaturedInterview: builder.query({
      query: (userId) => ({
        url: `/api/v1/featured-interview/${userId}`,
        method: "GET",
      }),
      providesTags: ["FeaturedInterview"],
    }),
  }),
});

export const {
  useAddFeaturedInterviewMutation,
  useUpdateFeaturedInterviewMutation,
  useGetFeaturedInterviewQuery,
} = featuredInterviewApi;
