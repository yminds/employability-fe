import { apiSlice } from './apiSlice';

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all user skills
    getUserSkills: builder.query<{
        data:[]
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
  }),
});

export const { useGetUserSkillsQuery, useGetUserSkillsSummaryQuery,useGetUserSkillDetailsQuery } = skillsApiSlice;