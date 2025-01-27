import { apiSlice } from './apiSlice';
interface Goal {
  title: string;
  _id: string;
  name: string;
  description: string;
  image?: string;
  skill_pool_id: string[];
  predefined_goal_id: string;
  job_market_demand: string;
  min_salary_range: number;
  max_salary_range: number;
  difficulty_level: string;
  learning_time: string;
  experience_level: string;
}

interface GoalsData {
  data: Goal[];
  message: string;
}


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
    getUserGoal: builder.query<GoalsData, string>({
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
    getSearchGoal: builder.query<GoalsData, string>({
      query: (searchTerm) => ({
        url: `/api/v1/predefinedGoals/search`, // Use searchTerm as the dynamic part of the URL
        method: 'GET',
        params: { search: searchTerm }, // Pass the search term as a query parameter
      }),
    }),
  }),
});

export const { useGetSearchGoalQuery } = searchGoalApiSlice;

export const filterGoalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    filterGoals: builder.mutation<any, {
      experience_level?: string;
      min_salary_range?: number;
      max_salary_range?: number;
      job_market_demand?: string;
      learning_time?: string;
      difficulty_level?: string;
    }>({
      query: (filterParams) => ({
        url: '/api/v1/predefinedGoals/getFilterGoals',
        method: 'POST',
        body: filterParams,
      }),
    }),
  }),
});

export const { useFilterGoalsMutation } = filterGoalsApiSlice;