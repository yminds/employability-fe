import { apiSlice } from './apiSlice'; // Assuming apiSlice is your base API slice setup

export const fundamentalsApiSlice = apiSlice.injectEndpoints({
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

    //get Fundementals bySkill id and level
    getUserFundamentalsBySkillId: builder.mutation<any, { skill_pool_id: string,level:string }>(
        {
            query: ({ skill_pool_id ,level}) => ({
            url: '/api/v1/fundamentals/getFundamentalbySkill',
            method: 'POST',
            body: {  skill_pool_id,level },
          }),
        }
      ),
      
    // Get fundamentals by predefined goal ID
    getFundamentalsByPredefinedGoal: builder.query<any, string>({
      query: (predefinedGoalId) => ({
        url: `/api/v1/fundamentals/byPredefinedGoal/${predefinedGoalId}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for components
export const {
  useGetUserFundamentalsByIdMutation,
  useGetUserFundamentalsBySkillIdMutation,
  useGetFundamentalsByPredefinedGoalQuery
} = fundamentalsApiSlice;
