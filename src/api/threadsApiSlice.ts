import { apiSlice } from "./apiSlice";

export const threadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createThread: builder.mutation<any, { title: string; body: string }>({
      query: ({ title }: { title: string | undefined }) => ({
        url: "/api/v1/threads",
        method: "POST",
        body: { title },
      }),
    }),
  }),
});

export const {} = threadsApiSlice;
