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
    addUserGoal: builder.mutation<any, { user_id: string; name: string; skill_pool_ids: string[]; description?: string; predefined_goal_id?: string }>({
      query: (newItem) => ({
        url: '/api/v1/goals/userGoals/add',  // The URL for creating the goal
        method: 'POST',
        body: newItem,  // Send the goal data in the body
      }),
    }),
  }),
});

export const { useAddUserGoalMutation } = createGoalApiSlice;

export const skillsPoolNameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMultipleSkillsName: builder.query<any[], string>({
      query: (searchTerm) => ({
        url: `/api/v1/predefinedGoals/goals/${searchTerm}`, // Use searchTerm as the dynamic part of the URL
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMultipleSkillsNameQuery } = skillsPoolNameApiSlice;

export const userGoalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserGoal: builder.query<any[], string>({
      query: (searchTerm) => ({
        url: `/api/v1/goals/userGoals/${searchTerm}`, // Use searchTerm as the dynamic part of the URL
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserGoalQuery } = userGoalApiSlice;

export const searchGoalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSearchGoal: builder.query<any[], string>({
      query: (searchTerm) => ({
        url: `/api/v1/predefinedGoals/search`, // Use searchTerm as the dynamic part of the URL
        method: 'GET',
        params: { search: searchTerm }, // Pass the search term as a query parameter
      }),
    }),
  }),
});

export const { useGetSearchGoalQuery } = searchGoalApiSlice;