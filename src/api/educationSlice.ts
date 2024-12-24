import { apiSlice } from "./apiSlice";

export const educationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch multiple education records with optional search query
    getEducations: builder.query<any[], string | void>({
      query: (searchTerm) => ({
        url: "/api/v1/", // Adjust the endpoint to your backend's education API
        method: "GET",
        params: searchTerm ? { search: searchTerm } : {}, // Pass search term as query parameter if provided
      }),
    }),

    // Fetch a single education record by ID
    getEducationById: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/education/${id}`,
        method: "GET",
      }),
    }),

    // Add a new education record
    addEducation: builder.mutation<any, any>({
      query: (newEducation) => ({
        url: "/api/v1/education",
        method: "POST",
        body: newEducation,
      }),
    }),

    // Update an existing education record by ID
    updateEducation: builder.mutation<any, { id: string; updatedEducation: any }>({
      query: ({ id, updatedEducation }) => ({
        url: `/api/v1/education/${id}`,
        method: "PUT",
        body: updatedEducation,
      }),
    }),

    // Delete an education record by ID
    deleteEducation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/education/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetEducationsQuery,
  useGetEducationByIdQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApiSlice;
