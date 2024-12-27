import { apiSlice } from './apiSlice';

export const certificatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCertificatesByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/api/v1/user_certification/user/${id}`,  // Endpoint with userId in URL
        method: 'GET',
      }),
    }),
  }),
});
export const { useGetCertificatesByUserIdQuery } = certificatesApiSlice;
