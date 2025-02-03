// /src/components/ChatMessage.tsx

import React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  id: number;
  message: string;
  role: "USER" | "AI";
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "USER";

  const MessageAvatar = isUser ? (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
      <User size={20} />
    </div>
  ) : (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
      <Bot size={20} />
    </div>
  );

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {MessageAvatar}
      <div
        className={`flex-1 max-w-[70%] p-4 rounded-2xl shadow-md ${
          isUser
            ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white ml-auto"
            : "bg-white border border-gray-100"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        ) : (
          <ReactMarkdown
            className="text-sm prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2"
            remarkPlugins={[remarkGfm]}
            components={MarkdownRenderer}
          >
            {message.message}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
