import { useCallback } from "react";
import { useCreateInterviewMutation } from "@/api/interviewApiSlice";
import { useCreateThreadMutation } from "@/api/threadApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Thread } from "@/api/models/thread";

const useCreateInterview = () => {
  const user_id = useSelector(
    (state: RootState) => state.auth.user?._id
  ) as string;

  const [createInterviewMutation, { isLoading, isSuccess, isError, error }] =
    useCreateInterviewMutation();

  const [
    createThreadMutation,
    {
      isLoading: isThreadLoading,
      isSuccess: isThreadSuccess,
      isError: isThreadError,
      error: threadError,
    },
  ] = useCreateThreadMutation();

  const createThread = useCallback(
    async (threadData: Thread) => {
      try {
        const response = await createThreadMutation({
          ...threadData,
          user_id,
        }).unwrap();
        return response.data._id;
      } catch (err) {
        throw err;
      }
    },
    [createThreadMutation, user_id]
  );

  const createInterview = useCallback(
    async (interviewData: {
      title: string;
      type: string;
      user_skill_id?: string;
      skill_id?: string;
    }) => {
      try {
        const thread_id = await createThread({
          user_id,
        });
        const response = await createInterviewMutation({
          title: interviewData.title,
          type: interviewData.type,
          user_skill_id: interviewData.user_skill_id,
          skill_id: interviewData.skill_id,
          user_id,
          thread_id,
        }).unwrap();

        return response.data._id;
      } catch (err) {
        console.error("Error creating interview:", err);
        throw err;
      }
    },
    [createInterviewMutation, createThread, user_id]
  );

  return {
    createInterview,
    isLoading,
    isSuccess,
    isError,
    error,
    createThread,
    isThreadLoading,
    isThreadSuccess,
    isThreadError,
    threadError,
  };
};

export { useCreateInterview };
