import { apiSlice } from "./apiSlice";




interface Skill{
    id:string
    name:string
}



export const SkillSuggestionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getSkillSuggestions: builder.mutation<Skill[], {query:string}>({
      query: ({query:query}) => ({
        url: `api/v1/skillSuggestions/getSuggestedSkills`,
        method: 'POST',
        body: {query:query},
      }),
    }),
    
    resetVectorDB:builder.mutation({
        query: () => ({
          url: `api/v1/skillSuggestions/resetVectorDB`,
          method: 'POST',
        }),
      })
}),
});

export const {useGetSkillSuggestionsMutation,useResetVectorDBMutation}=SkillSuggestionsApiSlice

