import { apiSlice } from './apiSlice';

export const goalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPreDefinedGoals: builder.query<any[], void>({
      query: () => ({
        url: '/api/v1/predefinedGoals/getAll',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllPreDefinedGoalsQuery } = goalsApiSlice;

// Create Goal
export const createGoalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGoal: builder.mutation<any, {user_id: string; name: string; skill_pool_ids: string[]; description?: string }>({
      query: (newItem) => ({
        url: '/api/v1/goals/userGoals',  // The URL for creating the goal
        method: 'POST',
        body: newItem,  // Send the goal data in the body
      }),
    }),
  }),
});

export const { useCreateGoalMutation } = createGoalApiSlice;