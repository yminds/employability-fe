import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Stream
    stream: builder.mutation({
      query: (options) => ({
        url: "/api/v1/ai/stream",
        method: "POST",
        body: { ...options },
      }),
    }),
    // TTS
    tts: builder.mutation<Blob, { text: string }>({
      query: (options) => ({
        url: "/api/v1/ai/tts",
        method: "POST",
        body: { ...options },
        responseHandler: (response: Response) => response.blob(), // Handle the response as a blob
      }),
    }),
  }),
});

export const { useStreamMutation, useTtsMutation } = aiApiSlice;
