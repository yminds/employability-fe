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