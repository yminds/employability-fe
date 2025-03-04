// hooks/useMessages.ts
import { useEffect } from "react";
import { useGetMessagesQuery } from "@/api/mentorUtils";

/**
 * A custom hook that fetches messages for a given chatId/userId.
 * Encapsulates the typical loading/refetch logic in one place.
 */
export function useMessages(chatId: string | null, userId: string | undefined) {
  // Skip fetching if there is no chatId
  const {
    data: threadMessagesData,
    refetch,
    isLoading,
    isError,
    isFetching,
  } = useGetMessagesQuery(
    { threadId: chatId || "", userId },
    { skip: !chatId }
  );

  // If you need to automatically refetch whenever chatId changes,
  // you can do it here. Typically, the RTK Query skip param handles that,
  // but it's up to you how you want to structure it:
  useEffect(() => {
    if (chatId) {
      refetch();
    }
  }, [chatId, refetch]);

  // Convert server messages to a simpler local shape:
  const messages = threadMessagesData?.data?.map((msg: any, index: number) => ({
    id: msg._id || index,
    message: msg.message,
    role: msg.role === "USER" ? "USER" : "AI",
  })) || [];

  return {
    messages,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
}
