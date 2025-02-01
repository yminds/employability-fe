import { apiSlice } from "./apiSlice";

interface Message {
  _id: string;
  thread_id: string;
  user_id: string;
  message: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ThreadData {
  _id: string;
  title: string;
  user_id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GetMessagesResponse {
  status: string;
  data: Message[];
}

interface GetThreadsResponse {
  status: string;
  data: ThreadData[];
}

interface GetMessagesParams {
  threadId: string;
  userId: string|undefined;
  page?: number;
  limit?: number;
}

interface GetThreadsParams {
  userId: string|undefined;
}

export const mentorUtilsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get messages of a thread
    getMessages: builder.query<GetMessagesResponse, GetMessagesParams>({
      query: ({ threadId, userId }) => ({
        url: "/api/v1/messages/getMessages",
        params: { threadId, userId },
      }),
    }),

    // Get threads by userId
    getThreadsByUserId: builder.query<GetThreadsResponse, GetThreadsParams>({
      query: ({ userId }) => ({
        url: `/api/v1/threads/getAllbyUserId/${userId}`,
        params: { id:userId },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useGetMessagesQuery, useGetThreadsByUserIdQuery } = mentorUtilsApiSlice;
 