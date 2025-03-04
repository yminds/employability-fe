import { apiSlice } from "./apiSlice";
import { MentorChat } from "@/api/models/MentorChat"; // Assuming you have a model for MentorChat


export const mentorChatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMentorChat: builder.mutation({
      query: (data: MentorChat) => ({
        url: `/api/v1/mentor-chat/create/${data.skill_id}`,
        method: "POST",
        body: { ...data },
      }),
    }),
    getMentorChatById: builder.query({
      query: (id: string) => ({
        url: `/api/v1/mentor-chat/${id}`,
        method: "GET",
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ thread_id, message, user_id }) => ({
        url: `/api/v1/messages/${thread_id}/messages`,
        method: "POST",
        body: { thread_id, message, user_id },
      }),
    }),
    sendMentorMessage: builder.mutation({
      query: ({ prompt, chatId, userId, fundamentals, skill }) => ({
        url: `/api/v1/ai/mentorstream`,
        method: "POST",
        body: {
          prompt,
          model: "gpt-4",
          provider: "openai",
          _id: chatId,
          thread_id: chatId,
          user_id: userId,
          code_snippet: "",
          question: "",
          fundamentals: fundamentals,
          skill: skill,
        },
      }),
    }),
    generateQuizQuestions: builder.mutation({
      query: ({ topic, user_id, thread_id, model = "gpt-4o", provider = "openai" }) => ({
        url: `/api/v1/mentor-chat/generate-quiz-questions`,
        method: "POST",
        body: { topic, model, provider, user_id, thread_id },
      }),
    }),
  }),
});

export const {
  useCreateMentorChatMutation,
  useGetMentorChatByIdQuery,
  useSendMessageMutation,
  useSendMentorMessageMutation,
  useGenerateQuizQuestionsMutation
} = mentorChatApiSlice;
