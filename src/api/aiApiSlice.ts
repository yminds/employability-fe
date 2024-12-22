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
    // STT
    stt: builder.mutation({
      query: (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob);

        return {
          url: "/api/v1/ai/stt", // Or your actual STT endpoint
          method: "POST",
          body: formData,
          transformResponse: (response: Response) => response,
        };
      },
    }),
  }),
});

export const { useStreamMutation, useTtsMutation, useSttMutation } = aiApiSlice;
