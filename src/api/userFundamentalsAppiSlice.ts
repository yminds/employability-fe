import { apiSlice } from './apiSlice'; // Assuming apiSlice is your base API slice setup

export const userFundamentalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch User Fundamentals using POST
    getUserFundamentalsById: builder.mutation<any, { user_id: string|undefined; skill_pool_id: string }>(
      {
        query: ({ user_id, skill_pool_id }) => ({
          url: '/api/v1/userfundamentals/getFundamentals',
          method: 'POST',
          body: { user_id, skill_pool_id },
        }),
      }
    ),

    // Update a fundamental's status using POST
    updateFundamentalStatus: builder.mutation<any, { user_id: string; skill_pool_id: string; fundamental_id: string; newStatus: 'Pending' | 'Completed' }>(
      {
        query: ({ user_id, skill_pool_id, fundamental_id, newStatus }) => ({
          url: '/api/userfundamentals/update-status',
          method: 'POST',
          body: { user_id, skill_pool_id, fundamental_id, newStatus },
        }),
      }
    ),
  }),
});

// Export hooks for components
export const {
  useGetUserFundamentalsByIdMutation,
  useUpdateFundamentalStatusMutation,
} = userFundamentalsApiSlice;
