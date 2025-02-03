// /src/hooks/useChatSocket.ts

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

interface UseChatSocketProps {
  chatId: string | null;
  onMessageReceived: (text: string) => void;
}

const useChatSocket = ({ chatId, onMessageReceived }: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!chatId) return;

    // Initialize Socket.IO connection
    socketRef.current = io(SOCKET_URL);

    // Listen for AI responses
    socketRef.current.on(`mentorResponse${chatId}`, (textPart: string) => {
      onMessageReceived(textPart);
    });

    // Cleanup on unmount or when chatId changes
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatId, onMessageReceived]);

  return {};
};

export default useChatSocket;
