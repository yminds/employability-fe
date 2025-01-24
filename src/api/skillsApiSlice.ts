import { apiSlice } from "./apiSlice";

// Define the Skill interface
interface Skill {
  level: string;
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
  };
  verified_rating: number;
  self_rating: number | null;
}

// Extend the apiSlice with skills-related endpoints
export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all user skills
    getUserSkills: builder.mutation<
      {
        data: {
          all: Skill[];
          allUserSkills: Skill[];
          mandatory: Skill[];
          optional: Skill[];
        };
      },
      { userId: string | undefined; goalId: string | null }
    >({
      query: ({ userId, goalId }) => ({
        url: `/api/v1/skills/userSkills/user/${userId}`, // Adjust endpoint to match your API
        method: "POST",
        body: {
          user_id: userId,
          goalId: goalId,
        },
      }),
    }),

    // Fetch a specific user's skills summary
    getUserSkillsSummary: builder.mutation<
      {
        data: {
          totalSkills: number;
          totalVerifiedSkills: number;
          excellent: number;
          intermediate: number;
          weak: number;
        };
      },
      { userId: string; goalId: string }
    >({
      query: ({ userId, goalId }) => ({
        url: `/api/v1/skills/userSkills/summary/${userId}`,
        method: "POST",
        body: {
          user_id: userId,
          goalId: goalId,
        },
      }),
    }),

    // Fetch detailed information for a specific skill by skill ID
    getUserSkillDetails: builder.query<any, string>({
      query: (skillId) => ({
        url: `/api/v1/skills/userSkills/${skillId}`,
        method: "GET",
      }),
    }),

    // Create new user skills
    createUserSkills: builder.mutation<
      any,
      {
        user_id: string;
        skills: {
          skill_pool_id: string;
          self_rating: number | null;
          level: string;
        }[];
        goal_id: string;
      }
    >({
      query: ({ user_id, skills, goal_id }) => ({
        url: "/api/v1/skills/userSkills",
        method: "POST",
        body: {
          user_id,
          skills,
          goal_id,
        },
      }),
    }),

    // Remove a goal from a specific skill
    removeGoalFromSkill: builder.mutation<
      {
        message: string;
        data: Skill;
      },
      { userId: string | undefined; goalId: string | null; skillId: string }
    >({
      query: ({ userId, goalId, skillId }) => ({
        url: "/api/v1/skills/userSkills/deleteSkill", // Adjust to match your backend endpoint
        method: "POST",
        body: {
          userId,
          goalId,
          skillId,
        },
      }),
    }),
    // Update the self_rating of a specific skill
    updateSelfRating: builder.mutation<
      {
        message: string;
        data: Skill;
      },
      { userId: string|undefined; skillId: string; selfRating: number }
    >({
      query: ({ userId, skillId, selfRating }) => ({
        url: `/api/v1/skills/userSkills/updateSelfRating/${skillId}`, // Adjust to match your backend endpoint
        method: "PATCH",
        body: {
          userId: userId,
          selfRating: selfRating,
          skillId:skillId
        },
      }),
    }),
  }),
});

// Export hooks for all mutations and queries
export const {
  useGetUserSkillsMutation,
  useGetUserSkillsSummaryMutation,
  useGetUserSkillDetailsQuery,
  useCreateUserSkillsMutation,
  useRemoveGoalFromSkillMutation,
  useUpdateSelfRatingMutation
} = skillsApiSlice;
