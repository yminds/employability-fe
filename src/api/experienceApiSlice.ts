import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.VITE_API_BASE_URL as string;

export const experienceApiSlice = createApi({
  reducerPath: "experienceApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Experience"],
  endpoints: (builder) => ({
    // Fetch experiences by user ID
    getExperiencesByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_experience/user/${id}`,
        method: "GET",
      }),
      providesTags: ["Experience"],
    }),

    // Add a new experience record
    addExperience: builder.mutation<any, any>({
      query: (newExperience) => ({
        url: "/api/v1/user_experience/experience",
        method: "POST",
        body: newExperience,
      }),
      invalidatesTags: ["Experience"],
    }),

    // Update an existing experience record by ID
    updateExperience: builder.mutation<
      any,
      { id: string; updatedExperience: any }
    >({
      query: ({ id, updatedExperience }) => ({
        url: `/api/v1/user_experience/experience/${id}`,
        method: "PUT",
        body: updatedExperience,
      }),
      invalidatesTags: ["Experience"],
    }),

    // Delete an experience record by ID
    deleteExperience: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/user_experience/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Experience"],
    }),
  }),
});

export const {
  useGetExperiencesByUserIdQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApiSlice;
