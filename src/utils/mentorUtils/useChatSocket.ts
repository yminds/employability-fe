import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

const useChatSocket = (chatId: string | null, setMessages: any) => {
  const [isStreaming, setIsStreaming] = useState(false);
  useEffect(() => {
    if (!chatId) return;
    const socket = io(SOCKET_URL);
    socket.on(`mentorResponse${chatId}`, (textPart: string) => {
      setIsStreaming(false);
      setMessages((prev: string | any[]) => [...prev, { id: prev.length + 1, message: textPart, role: "AI" }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  return { isStreaming };
};

export default useChatSocket;
