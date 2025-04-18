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
    tts: builder.mutation<Blob, { text: string,interviewId:string }>({
      query: (options) => ({
        url: "/api/v1/ai/tts",
        method: "POST",
        body: { ...options },
        responseHandler: (response: Response) => response.blob(), // Handle the response as a blob
      }),
    }),
    // STT
    stt: builder.mutation({
      query: ({ audioBlob, interviewId }: { audioBlob: Blob; interviewId: string }) => {
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("interviewId", interviewId);

        return {
          url: "/api/v1/ai/stt", // Or your actual STT endpoint
          method: "POST",
          body: formData,
          transformResponse: (response: Response) => response,
        };
      },
    }),

    interviewStream: builder.mutation({
      query: (options) => ({
        url: "/api/v1/ai/interviewStream",
        method: "POST",
        body: { ...options },
      }),
    }),
  }),
});

export const { useStreamMutation, useTtsMutation, useSttMutation, useInterviewStreamMutation } = aiApiSlice;
