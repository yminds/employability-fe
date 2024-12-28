import { apiSlice } from './apiSlice';

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all user skills
    getUserSkills: builder.query<{
        data:[
          {
            _id: string;
            skill_pool_id: {
              _id: string;
              name: string;
              icon: string;
            };
            verified_rating: number;
            self_rating: number;
          }
        ]
    }, string>({
      query: (userId) => ({
        url: `/api/v1/skills/userSkills/user/${userId}`, // Append the userId to the URL
        method: 'GET',
      }),
    }),

    // Fetch a specific user skill by skill ID
    getUserSkillsSummary: builder.query<any, string >({
      query: ( userId ) => ({
        url: `api/v1/skills/userSkills/summary/${userId}`, // Append userId and skillId
        method: 'GET',
      }),
    }),

    getUserSkillDetails:builder.query<any, string >({
        query: ( skillId ) => ({
          url: `api/v1/skills/userSkills/${skillId}`,
          method: 'GET',
        }),
      }),
    
      createUserSkills: builder.mutation<any, { user_id: string; skills: { skill_pool_id: string; self_rating: number, goal_id : string}[] }>({
        query: ({ user_id, skills ,goal_id}) => ({
          url: '/api/v1/skills/userSkills', // Replace with your endpoint
          method: 'POST',
          body: {
            user_id,
            skills,
            goal_id
          },
        }),
      }),
  }),
});

export const { useGetUserSkillsQuery, useGetUserSkillsSummaryQuery,useGetUserSkillDetailsQuery, useCreateUserSkillsMutation } = skillsApiSlice;