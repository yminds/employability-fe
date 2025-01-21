import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Tech{
    _id:string;
    name:string;
    icon:string
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


const baseUrl = process.env.VITE_API_BASE_URL as string;

export const projectApiSlice = createApi({
    reducerPath:"projectApiSlice",
    baseQuery:fetchBaseQuery({baseUrl}),
    tagTypes:["Project"],
    endpoints:(builder) =>({
        getProjectsByUserId: builder.query<{success: boolean, data: Project[], count: number}, string>({
            query: (userId) => ({
                url: `/api/v1/user_projects/user/${userId}`,
                method: 'GET',
            })
        }),
        addProject: builder.mutation<{success: boolean, data: Project}, {name: string; description: string}>({
            query: (payload) => ({
                url: `/api/v1/user_projects`,
                method: "POST",
                body: payload
            })
        }),
        updateProjectTech: builder.mutation<{success: boolean, data: Project}, {projectId: string, technologies: string[]}>({
            query: ({projectId, technologies}) => ({
                url: `/api/v1/user_projects/${projectId}/tech`,
                method: 'PATCH',
                body: { technologies }
            })
        }),
        handleProjectFiles: builder.mutation<{success: boolean, data: Project}, {projectId: string, formData: FormData}>({
            query: ({projectId, formData}) => ({
                url: `/api/v1/user_projects/${projectId}/files`,
                method: 'PATCH',
                body: formData
            })
        }),
        getProject: builder.query<{success: boolean, data: Project}, string>({
            query: (projectId) => ({
                url: `/api/v1/user_projects/${projectId}`,
                method: 'GET'
            })
        }),
        updateProject:builder.mutation<{success:boolean,data:Project},{projectId:string,payload:Partial<Project>}>({
            query:({projectId,payload})=>({
                url:`/api/v1/user_projects/${projectId}`,
                method:'PATCH',
                body:payload
            })
        }),
        deleteProject:builder.mutation<{success:boolean;message:string},{projectId:string;userId:string}>({
            query:({projectId,userId})=>({
                url:`/api/v1/user_projects/${projectId}`,
                method:'DELETE',
                body:{userId}
                })
        })
    })
})

export const {useGetProjectsByUserIdQuery,useAddProjectMutation,useUpdateProjectTechMutation,useHandleProjectFilesMutation,useGetProjectQuery,useUpdateProjectMutation,useDeleteProjectMutation} = projectApiSlice