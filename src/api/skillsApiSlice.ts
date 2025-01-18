import { apiSlice } from './apiSlice';
interface Skill {
  _id: string,
  skill_pool_id: {
    _id:string,
    name:string
  },
  verified_rating:number
  self_rating: number | null;
}[];

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all user skills
      getUserSkills: builder.mutation<
      {
        data: {
          all:Skill[],
          allUserSkills:Skill[],
          mandatory:Skill[],
          optional:Skill[]
        }
      },
      { userId: any; goalId: any }
      >({
      query: ({ userId, goalId }) => ({
        url: `/api/v1/skills/userSkills/user/${userId}`, // Adjusted the endpoint to remove userId from the URL
        method: 'POST',
        body: {
          user_id: userId,
          goalId: goalId,
        },
      }),
    }),
  
    // Fetch a specific user skill by skill ID
    getUserSkillsSummary: builder.mutation<any, { userId: any; goalId: any } >({
      query: ( { userId, goalId } ) => ({
        url: `api/v1/skills/userSkills/summary/${userId}`, // Append userId and skillId
        method: 'POST',
        body:{
          user_id: userId,
          goalId: goalId, 
        }
      }),
    }),

    getUserSkillDetails:builder.query<any, string >({
        query: ( skillId ) => ({
          url: `api/v1/skills/userSkills/${skillId}`,
          method: 'GET',
        }),
      }),
    
      createUserSkills: builder.mutation<any, { user_id: string; skills: { skill_pool_id: string; self_rating: number}[] ,goal_id : string }>({
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

export const { useGetUserSkillsMutation, useGetUserSkillsSummaryMutation, useGetUserSkillDetailsQuery, useCreateUserSkillsMutation } = skillsApiSlice;