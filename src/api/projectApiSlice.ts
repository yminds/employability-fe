import { apiSlice } from "./apiSlice";

// Define interfaces for better type safety
export interface Tech {
  _id: string;
  name: string;
  icon: string;
}

export interface Project {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  tech: Tech[];
  githubLink: string[];
  liveLink: string;
  thumbnail: string;
  images: string;
  synopsisDoc: string;
  synopsis: string;
  result: string;
  status: 'Incomplete' | 'In-review' | 'Unverified' | 'Verified';
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectResponse {
  success: boolean;
  data: Project;
}

interface ProjectListResponse {
  success: boolean;
  data: Project[];
  count: number;
}

interface DeleteProjectResponse {
  success: boolean;
  message: string;
}

interface ProjectQueryParams {
  userId: string;
  goalId?: string;
}


// Extend the apiSlice with project-related endpoints
export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects for a specific user
    getProjectsByUserId: builder.query<ProjectListResponse, ProjectQueryParams>({
      query: ({userId,goalId}) => ({
        url: `/api/v1/user_projects/user/${userId}`,
        method: 'GET',
        params: goalId ? {goalId} : undefined
      }),
    }),

    // Get a specific project by ID
    getProject: builder.query<ProjectResponse, string>({
      query: (projectId) => ({
        url: `/api/v1/user_projects/${projectId}`,
        method: 'GET',
      }),
    }),

    // Create a new project
    addProject: builder.mutation<
      ProjectResponse,
      {
        name: string;
        description: string;
        status?: string;
        goal_id?: string;
        user_id?: string;
      }
    >({
      query: (payload) => ({
        url: `/api/v1/user_projects`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Update project technologies
    updateProjectTech: builder.mutation<
      ProjectResponse,
      {
        projectId: string;
        technologies: string[];
      }
    >({
      query: ({ projectId, technologies }) => ({
        url: `/api/v1/user_projects/${projectId}/tech`,
        method: 'PATCH',
        body: { technologies },
      }),
    }),

    // Handle project file uploads
    handleProjectFiles: builder.mutation<
      ProjectResponse,
      {
        projectId: string;
        formData: FormData;
      }
    >({
      query: ({ projectId, formData }) => ({
        url: `/api/v1/user_projects/${projectId}/files`,
        method: 'PATCH',
        body: formData,
      }),
    }),

    // Update project details
    updateProject: builder.mutation<
      ProjectResponse,
      {
        projectId: string;
        payload: Partial<Project>;
      }
    >({
      query: ({ projectId, payload }) => ({
        url: `/api/v1/user_projects/${projectId}`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    // Delete a project
    deleteProject: builder.mutation<
      DeleteProjectResponse,
      {
        projectId: string;
        userId: string;
      }
    >({
      query: ({ projectId, userId }) => ({
        url: `/api/v1/user_projects/${projectId}`,
        method: 'DELETE',
        body: { userId },
      }),
    }),
  }),
});

// Export hooks for all mutations and queries
export const {
  useGetProjectsByUserIdQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectTechMutation,
  useHandleProjectFilesMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApiSlice;