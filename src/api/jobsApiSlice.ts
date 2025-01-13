// src/api/exampleApiSlice.ts
import { apiSlice } from './apiSlice';

interface Job {
    id: number;
    title: string;
    company: string;
    type: string;
    locations: string[];
    skills: string[]; // Directly store skill names
    status?: string;
    logo: string;
    salary?: string;
    minimumExperience: number;
}

// Query parameters interface
export interface JobSearchParams {
  page?: number; // Page number, default is 1
  locations?: string[]; // Array of locations
  minimumSalary?: number; // Minimum salary filter
  minimumExperience?: number | null; // Minimum experience filter, default null
  jobRoles?: string[]; // Array of job roles
  jobTypes?: string[]; // Array of job types
  companySize?: string | null; // Company size filter
  onlyRemoteJobs?: boolean; // Filter for only remote jobs
}



// export const jobApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllJobs: builder.mutation< Job[], { page:number,filter:JobSearchParams}>({
//       query: (page:number,filter:JobSearchParams) => ({
//         url: `/api/v1/jobs/alljobs`,
//         method: 'POST',
//         body: {page,...filter},
//       }),
//     }),
//   }),
// });

// export const { useGetAllJobsQuery } = jobApiSlice;



// Define the query parameters interface
export interface JobSearchParams {
  page?: number; // Page number, default is 1
  search?:string;
  locations?: string[]; // Array of locations
  minimumSalary?: number; // Minimum salary filter
  minimumExperience?: number | null; // Minimum experience filter, default null
  jobRoles?: string[]; // Array of job roles
  jobTypes?: string[]; // Array of job types
  companySize?: string | null; // Company size filter
  onlyRemoteJobs?: boolean; // Filter for only remote jobs
}

// Inject the endpoints into the API slice
export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getAllJobs: builder.mutation<Job[], { page: number; filters: JobSearchParams }>({
      query: ({ page, filters }) => ({
        url: `/api/v1/jobs/alljobs`,
        method: 'POST',
        body: { page, ...filters },
      }),
    }),
  }),
});


export const { useGetAllJobsMutation } = jobApiSlice;



interface jobRoleSuggestions{
  roles:string[]
}

export const JobRoleSuggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getJobRoleSuggestions: builder.mutation<jobRoleSuggestions, { search:string}>({
      query: ({search}) => ({
        url: `api/v1/jobs/jobRoleSuggestions`,
        method: 'POST',
        body: { search:search },
      }),
    }),
  }),
});


export const { useGetJobRoleSuggestionsMutation } = JobRoleSuggestionApiSlice;


interface locationSuggestion{
  locations:string[]
}


export const JobLocationSuggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to fetch all jobs
    getJobLocationSuggestions: builder.mutation<locationSuggestion, { search:string}>({
      query: ({search}) => ({
        url: `api/v1/jobs/jobLocationSuggestions`,
        method: 'POST',
        body: { search:search },
      }),
    }),
  }),
});

export const { useGetJobLocationSuggestionsMutation } = JobLocationSuggestionApiSlice;








