import { apiSlice } from "./apiSlice";

export const educationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a single education record by ID
    getEducationById: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_education/education/${id}`,
        method: "GET",
      }),
      providesTags: ["Education"],
    }),

    // Add a new education record
    addEducation: builder.mutation<any, any>({
      query: (newEducation) => ({
        url: "/api/v1/user_education/education",
        method: "POST",
        body: newEducation,
      }),
      invalidatesTags: ["Education"],
    }),

    // Update an existing education record by ID
    updateEducation: builder.mutation<
      any,
      { id: string; updatedEducation: any }
    >({
      query: ({ id, updatedEducation }) => ({
        url: `/api/v1/user_education/education/${id}`,
        method: "PUT",
        body: updatedEducation,
      }),
      invalidatesTags: ["Education"],
    }),

    // Delete an education record by ID
    deleteEducation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/user_education/education/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Education"],
    }),
  }),
});

export const {
  useGetEducationByIdQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApiSlice;
