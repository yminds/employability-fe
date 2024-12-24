import { apiSlice } from './apiSlice';

export const goalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all predefined goals
    getAllPreDefinedGoals: builder.query<any[], void>({
      query: () => ({
        url: '/api/v1/predefinedGoals/getAll',
        method: 'GET',
      }),
    }),

    getGoalsbyuser: builder.query<{
      message:string,
      data: [
        {
          name: string
        }
      ]
    }, void>({
      query: (userId) => ({
        url: `/api/v1/goals/userGoals/${userId}`,
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

export const { useGetAllPreDefinedGoalsQuery, useUpdateGoalNameMutation ,useGetGoalsbyuserQuery } = goalsApiSlice;
