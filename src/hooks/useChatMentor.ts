import { useCallback } from "react";
import { useCreateThreadMutation } from "@/api/threadApiSlice";
import { useCreateMentorChatMutation, useSendMessageMutation } from "@/api/mentorChatApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Thread } from "@/api/models/thread";

interface MentorChatData {
  skill_id: string;
  skill_pool_id: string;
  title?: string|undefined;
}

const useMentorChat = () => {
  const user_id = useSelector((state: RootState) => state.auth.user?._id) as string;

  const [createMentorChatMutation, { isLoading }] = useCreateMentorChatMutation();
  const [createThreadMutation, { isLoading: isThreadLoading }] = useCreateThreadMutation();
  const [sendMessageMutation] = useSendMessageMutation();

  const createThread = useCallback(async (threadData: Thread) => {
    try {
      const response = await createThreadMutation({ ...threadData, user_id }).unwrap();
      return response.data._id;
    } catch (err) {
      throw err;
    }
  }, [createThreadMutation, user_id]);

  const startMentorChat = useCallback(async (chatData: MentorChatData) => {
    try {
      const thread_id = await createThread({ user_id, title: chatData.title || "Mentor Chat" });

      const response = await createMentorChatMutation({
        title: chatData.title||"",
        user_id,
        thread_id,
        skill_id: chatData.skill_id,
        skill_pool_id: chatData.skill_pool_id,
        skill: "test skill",
      }).unwrap();

      return {
        chatId: response.data._id,
        threadId: thread_id,
      };
    } catch (err) {
      console.error("Error starting mentor chat:", err);
      throw err;
    }
  }, [createMentorChatMutation, createThread, user_id]);

  const sendMessage = useCallback(async (thread_id: string, message: string) => {
    try {
      const response = await sendMessageMutation({ thread_id, message, user_id }).unwrap();
      return response.data;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  }, [sendMessageMutation, user_id]);

  return { startMentorChat, sendMessage, isLoading: isLoading || isThreadLoading };
};

export { useMentorChat };
