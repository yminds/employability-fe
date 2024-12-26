import { apiSlice } from "./apiSlice";

export const educationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a single education record by ID
    getEducationById: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_education/education/${id}`, // Ensure this matches the backend
        method: "GET",
      }),
    }),

    // Add a new education record
    addEducation: builder.mutation<any, any>({
      query: (newEducation) => ({
        url: "/api/v1/user_education/education/${id}",
        method: "POST",
        body: newEducation,
      }),
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
    }),

    // Delete an education record by ID
    deleteEducation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/user_education/education${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetEducationByIdQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApiSlice;
