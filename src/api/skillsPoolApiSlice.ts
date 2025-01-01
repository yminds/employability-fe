import { apiSlice } from './apiSlice';

// Modify the query definition to pass search as a query parameter
export const skillsPoolApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMultipleSkills: builder.query<{
      data: [
        {
          _id: string;
          name: string;
        }];
    }, string>({
      query: (searchTerm) => ({
        url: '/api/v1/skills_pool/skills', // The endpoint you're calling
        method: 'GET',
        params: { search: searchTerm }, // Pass the search term as a query parameter
      }),
    }),
  }),
});

export const { useGetMultipleSkillsQuery } = skillsPoolApiSlice;