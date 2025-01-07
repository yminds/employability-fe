import { apiSlice } from './apiSlice';

export const goalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGoalsbyuser: builder.query<{
      message:string,
      data: [
        {
          _id : string,
          name: string
          experience:string
        }
      ]
    }, string | undefined>({
      query: (userId) => ({
        url: `/api/v1/goals/userGoals/${userId}`,
        method: 'GET',
      }),
    }),

    // Update a specific goal name
    updateGoalName: builder.mutation<any, { goalId: string; name: string }>({
      query: ({ goalId, name }) => ({
        url: `/api/v1/goals/userGoals/${goalId}`, // API endpoint for updating a goal
        method: 'PUT', // HTTP method
        body: { name }, // Payload containing the new goal name
      }),
    }),
  }),
});

export const { useUpdateGoalNameMutation ,useGetGoalsbyuserQuery } = goalsApiSlice;
