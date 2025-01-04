import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.VITE_API_BASE_URL as string;

// Define types for better TypeScript support
interface IProject {
  _id: string;
  user_id: string;
  projectName: string;
  description: string;
  skills: string[];
  githubLink: string;
  liveLink: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IProjectResponse {
  message: string;
  data: IProject;
}

export const projectApiSlice = createApi({
  reducerPath: "projectApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    // Get projects by user ID
    getProjectsByUserId: builder.query<IProject[], string>({
      query: (id) => ({
        url: `/api/v1/user_projects/user/${id}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    // Add a new project
    addProject: builder.mutation<
      IProjectResponse,
      Omit<IProject, "_id" | "createdAt" | "updatedAt">
    >({
      query: (newProject) => ({
        url: "/api/v1/user_projects/upload",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Project"],
    }),

    // Update an existing project
    updateProject: builder.mutation<
      IProjectResponse,
      { id: string; updatedProject: Partial<IProject> }
    >({
      query: ({ id, updatedProject }) => ({
        url: `/api/v1/user_projects/${id}`,
        method: "PUT",
        body: updatedProject,
      }),
      invalidatesTags: ["Project"],
    }),

    // Delete a project
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/v1/user_projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsByUserIdQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApiSlice;
