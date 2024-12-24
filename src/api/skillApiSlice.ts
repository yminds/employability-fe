import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.VITE_API_BASE_URL as string; // Make sure to set your base URL

export const skillApi = createApi({
  reducerPath: "skillApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    verifySkills: builder.mutation({
      query: (skills: string[]) => ({
        url: "/api/v1/skills_pool/skills", // Endpoint for skill verification
        method: "POST",
        body: { skills },
      }),
    }),
  }),
});

export const { useVerifySkillsMutation } = skillApi;
