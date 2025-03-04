import { apiSlice } from "./apiSlice";

export const interviewDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVerifiedSkills: builder.mutation({
      query: ({ userId, goalId }) => ({
        url: `/api/v1/interview-details/verifiedSkills/user/${userId}`,
        method: "POST",
        body: {
          user_id: userId,
          goalId: goalId,
        },
      }),
    }),
  }),
});

export const { useGetVerifiedSkillsMutation } = interviewDetailsApi;
