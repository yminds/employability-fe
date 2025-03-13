import { apiSlice } from "./apiSlice";
import { Thread } from "./models/Thread";

export const threadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createThread: builder.mutation({
      query: (data: Thread) => ({
        url: "/api/v1/threads/create",
        method: "POST",
        body: { ...data },
      }),
    }),

    getThreadByUserAndTitle: builder.query<any, { userId: string|undefined; title: string }>({
      query: ({ userId, title }) => ({
        url: `/api/v1/threads/getAllbyUserIdAndTitle/${userId}/${title}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateThreadMutation, useGetThreadByUserAndTitleQuery } = threadApiSlice;
