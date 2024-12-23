import { apiSlice } from './apiSlice';

export const goalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all predefined goals
    getAllPreDefinedGoals1: builder.query<any[], void>({
      query: () => ({
        url: '/api/v1/predefinedGoals/getAll',
        method: 'GET',
      }),
    }),

    // Update a specific goal name
    updateGoalName: builder.mutation<any, { userId: string; name: string }>({
      query: ({ userId, name }) => ({
        url: `/api/v1/goals/userGoals/${userId}`, // API endpoint for updating a goal
        method: 'PUT', // HTTP method
        body: { name }, // Payload containing the new goal name
      }),
    }),
  }),
});

export const { useGetAllPreDefinedGoals1Query, useUpdateGoalNameMutation } = goalsApiSlice;
