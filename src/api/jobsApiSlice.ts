// src/api/exampleApiSlice.ts
import { apiSlice } from "./apiSlice";

interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  locations: string[];
  skills: { _id: string; name: string }; // Directly store skill names
  status?: string;
  logo: string;
  salary?: string;
  minimumExperience: number;
}
export interface JobSearchParams {
  page?: number; // Page number, default is 1
  search?: string;
  locations?: string[];
  workType?: string[]; // Array of locations
  minimumSalary?: number; // Minimum salary filter
  minimumExperience?: number | null; // Minimum experience filter, default null
  jobRoles?: string[]; // Array of job roles
  jobTypes?: string[]; // Array of job types
  companySize?: string | null; // Company size filter
  onlyRemoteJobs?: boolean;
  skills: string[]; // Filter for only remote jobs
}

// Interface for Skill Analysis Request
export interface SkillAnalysisRequest {
  jobId: string;
  userSkills: string[];
  userSoftSkills?: string[];
  userEducation?: string[];
  userExperience?: string[];
}

// Interface for Skill Analysis Response
export interface SkillAnalysisResponse {
  overallAnalysis: {
    summary: string;
    recommendationLevel: string;
    recommendationConfidence: number;
  };

  technicalSkillsAnalysis: {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    skillStrengths: string[];
    skillGapRecommendations: string[];
  };

  softSkillsAnalysis: {
    matchPercentage: number;
    strengths: string[];
    areasForDevelopment: string[];
  };

  educationAnalysis: {
    degreeRelevance: string;
    academicPerformance: {
      cgpa: number;
      performanceDescription: string;
    };
    educationalBackground: {
      highestDegree: string;
      institutionTier: string;
    };
    educationGaps: string[];
  };

  experienceAnalysis: {
    careerProgressionScore: number;
    relevantExperiencePercentage: number;
    employmentTypes: string[];
    strengths: string[];
    experienceGaps: string[];
  };

  culturalFit: {
    companyValues: string[];
    culturalAlignmentScore: number;
    alignmentDetails: {
      strengths: string[];
      potentialChallenges: string[];
      recommendedAdaptationStrategies: string[];
    };
    teamDynamicsFit: string;
  };

  careerGrowthPotential: {
    shortTermOpportunities: string[];
    longTermDevelopmentPath: string[];
  };

  recommendedSkills: {
    name: string;
    id: string;
  }[];
}

// Inject the endpoints into the API slice
export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getAllJobs: builder.mutation<
      Job[],
      { page: number; filters: JobSearchParams }
    >({
      query: ({ page, filters }) => ({
        url: `/api/v1/jobs/alljobs`,
        method: "POST",
        body: { page, ...filters },
      }),
    }),
  }),
});

export const { useGetAllJobsMutation } = jobApiSlice;

interface jobRoleSuggestions {
  roles: string[];
}

export const JobRoleSuggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getJobRoleSuggestions: builder.mutation<
      jobRoleSuggestions,
      { search: string }
    >({
      query: ({ search }) => ({
        url: `api/v1/jobs/jobRoleSuggestions`,
        method: "POST",
        body: { search: search },
      }),
    }),
  }),
});

export const { useGetJobRoleSuggestionsMutation } = JobRoleSuggestionApiSlice;

interface locationSuggestion {
  locations: string[];
}

export const JobLocationSuggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getJobLocationSuggestions: builder.mutation<
      locationSuggestion,
      { search: string }
    >({
      query: ({ search }) => ({
        url: `api/v1/jobs/jobLocationSuggestions`,
        method: "POST",
        body: { search: search },
      }),
    }),
  }),
});

export const { useGetJobLocationSuggestionsMutation } =
  JobLocationSuggestionApiSlice;

export const SkillAnalysisApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobSkillAnalysis: builder.query<
      SkillAnalysisResponse,
      SkillAnalysisRequest
    >({
      query: (analysisData) => ({
        url: `/api/v1/jobs/skill-analysis`,
        method: "POST",
        body: analysisData,
      }),
      providesTags: (_result, _error, { jobId }) => [
        {
          type: "SkillAnalysis",
          id: jobId,
        },
      ],
      keepUnusedDataFor: 1800, // 1800 seconds = 30 minutes
    }),
  }),
});

export const { useGetJobSkillAnalysisQuery } = SkillAnalysisApiSlice;

export const SaveJobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveJob: builder.mutation({
      query: ({ jobId, userId }) => ({
        url: "/api/v1/jobs/save",
        method: "POST",
        body: { job_id: jobId, user_id: userId },
      }),
      invalidatesTags: ["Job"],
    }),

    getSavedJobs: builder.query<Job[], string>({
      query: (userId) => ({
        url: "/api/v1/jobs/saved",
        method: "POST",
        body: { user_id: userId },
      }),
      providesTags: ["Job"],
    }),
  }),
});

export const { useSaveJobMutation, useGetSavedJobsQuery } = SaveJobApiSlice;
