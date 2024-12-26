import { apiSlice } from "./apiSlice";
import { Thread } from "./models/thread";

export const threadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createThread: builder.mutation({
      query: (data: Thread) => ({
        url: "/api/v1/threads/create",
        method: "POST",
        body: { ...data },
      }),
    }),
  }),
});

export const { useCreateThreadMutation } = threadApiSlice;
