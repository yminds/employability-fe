import { apiSlice } from "./apiSlice";

export const certificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch certifications by user ID
    getCertificationsByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_certification/user/${id}`,
        method: "GET",
      }),
      providesTags: ["Certification"],
    }),

    // Add a new certification record
    addCertification: builder.mutation<any, any>({
      query: (newCertification) => ({
        url: "/api/v1/user_certification/certification",
        method: "POST",
        body: newCertification,
      }),
      invalidatesTags: ["Certification", "VerifiedContent"],
    }),

    // Update an existing certification record by ID
    updateCertification: builder.mutation<
      any,
      { id: string; updatedCertification: any }
    >({
      query: ({ id, updatedCertification }) => ({
        url: `/api/v1/user_certification/certification/${id}`,
        method: "PUT",
        body: updatedCertification,
      }),
      invalidatesTags: ["Certification"],
    }),

    // Delete a certification record by ID
    deleteCertification: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/user_certification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certification", "VerifiedContent"],
    }),
  }),
});

export const {
  useGetCertificationsByUserIdQuery,
  useAddCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} = certificationsApiSlice;
