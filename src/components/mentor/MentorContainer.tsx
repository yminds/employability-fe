import { useState, useEffect, useRef, useMemo } from "react";
import { Send, User, Copy } from "lucide-react";
import FundamentalBar from "@/components/mentor/FundamentalsList";
import { useGetUserFundamentalsByIdMutation } from "@/api/userFundamentalsAppiSlice";
import { useMentorChat } from "@/hooks/useChatMentor";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSendMentorMessageMutation } from "@/api/mentorChatApiSlice";
import { io } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  useGetMessagesQuery,
} from "@/api/mentorUtils";
import React from "react";
import logo from "@/assets/skills/e-Logo.svg";
import { useGetThreadByUserAndTitleQuery } from "@/api/threadApiSlice";

interface ThreadData {
  _id: string;
  title: string;
  user_id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const SOCKET_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "wss://employability.ai";

interface MentorContainerProps {
  skill: string;
  skillId: string;
  skillPoolId: string;
}

interface Message {
  id: number;
  message: string;
  role: "USER" | "AI";
}

/** 
 * Utility to extract a YouTube Video ID from a typical YouTube URL. 
 */
const getVideoId = (url: string) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

/**
 * Memoized YouTube embed component:
 * - Wrapped with React.memo to prevent unnecessary re-mounts.
 * - Uses a local useMemo to derive the videoId from the src prop.
 */
const YouTubeEmbed = React.memo(
  ({
    src,
    width = "100%",
    height = "400px",
  }: {
    src: string;
    width?: string;
    height?: string;
  }) => {
    const videoId = useMemo(() => getVideoId(src), [src]);
    if (!videoId) return null;

    return (
      <div className="youtube-embed-container my-4 w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          width={width}
          height={height}
        />
      </div>
    );
  }
);

const MentorContainer: React.FC<MentorContainerProps> = ({
  skill,
  skillId,
  skillPoolId,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fundamentals, setFundamentals] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const title = `${skill}'s Mentor Thread`;
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [fetchFundamentals] = useGetUserFundamentalsByIdMutation();
  const { startMentorChat } = useMentorChat();
  const [sendMentorMessage] = useSendMentorMessageMutation();

  // Get existing thread by user & title
  const { data: thread, isLoading: isThreadLoading } = useGetThreadByUserAndTitleQuery({
    id: userId,
    title,
  });
  console.log("thread",thread);

  const { data: threadMessagesData, isLoading: isMessagesLoading, refetch: refetchMessages } = useGetMessagesQuery({
    threadId: chatId || "",
    userId: userId,
  }, { skip: !chatId });

  useEffect(() => {
    if (threadMessagesData?.data) {
      const serverMessages = threadMessagesData.data;
      const loadedMessages: Message[] = serverMessages.map((msg: any, index: number) => ({
        id: index,
        message: msg.message,
        role: msg.role === "USER" ? "USER" : "AI",
      }));
      setMessages(loadedMessages);
      setIsLoading(false);
    }
  }, [threadMessagesData, userId]);

  // Initialize chat and fundamentals once
  useEffect(() => {
    const initializeChat = async () => {
      if (!userId || !skillId || !skillPoolId || isInitialized) return;
      try {
        setIsLoading(true);

        // 1. Load fundamentals
        const fundamentalsResponse = await fetchFundamentals({
          user_id: userId,
          skill_pool_id: skillPoolId,
        }).unwrap();
        setFundamentals(fundamentalsResponse?.data?.fundamentals || []);

        // 2. If a thread for this skill already exists, set chatId. Otherwise, create a new thread.
        let currentChatId;
        if (thread?.data) {
          currentChatId = thread.data._id;
          console.log("currentChatId",currentChatId);
          setChatId(currentChatId);
        } else {
          const { chatId: newChatId } = await startMentorChat({
            title: `${skill}'s Mentor Thread`,
            skill_id: skillId,
            skill_pool_id: skillPoolId,
          });
          currentChatId = newChatId;
          setChatId(newChatId);

          // Show an initial "Thinking..." message for new threads
          setMessages([{ id: 0, message: "Thinking...", role: "AI" }]);
          if (newChatId) {
            // 3. Send a default "Hello" to start the conversation
            await sendInitialMessage(newChatId);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setIsLoading(false);
      }
    };

    if (!isThreadLoading && !isInitialized) {
      initializeChat();
    }
  }, [
    userId,
    skillId,
    skillPoolId,
    thread?.data,
    isInitialized,
    fetchFundamentals,
    startMentorChat,
    isThreadLoading,
  ]);

  useEffect(() => {
    if (chatId) {
      refetchMessages();
    }
  }, [chatId, refetchMessages]);

  const sendInitialMessage = async (currentChatId: string) => {
    try {
      setIsStreaming(true);
      const initialMessage = "Hello";
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, message: initialMessage, role: "USER" },
      ]);
      await sendMentorMessage({
        prompt: initialMessage,
        chatId: currentChatId,
        userId,
        fundamentals,
        skill,
      }).unwrap();
    } catch (error) {
      console.error("Error sending initial message:", error);
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  // ---------- SOCKET.IO LOGIC ----------
  useEffect(() => {
    if (!chatId) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on(`mentorResponse${chatId}`, (textPart: string) => {
      setIsStreaming(false);
      setIsLoading(false);
      updateAIMessage(textPart);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  // Append or update the AI message in local state
  const updateAIMessage = (text: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === "AI") {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, message: lastMessage.message + text },
        ];
      }
      return [...prev, { id: prev.length + 1, message: text, role: "AI" }];
    });
  };

  // Send user message to server
  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || !chatId || !userId || isStreaming) return;

    try {
      // Add user message to local state
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, message, role: "USER" },
      ]);
      setInputMessage("");
      setIsStreaming(true);

      // Send message to your Mentor API
      await sendMentorMessage({
        prompt: message,
        chatId,
        userId,
        fundamentals,
        skill,
      }).unwrap();
    } catch (error) {
      console.error("Error sending message:", error);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          message:
            "Sorry, there was an error sending your message. Please try again.",
          role: "AI",
        },
      ]);
    }
  };

  // Handle "Enter" key to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show a temporary toast for copy feedback
  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  };

  // ---------- MARKDOWN COMPONENTS ----------
  const MarkdownComponents = useMemo(() => {
    return {
      code({
        inline,
        className,
        children,
        ...props
      }: {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
      }) {
        const match = /language-(\w+)/.exec(className || "");
        const handleCopy = () => {
          navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
          showToast("Code copied to clipboard!");
        };

        return !inline && match ? (
          <div className="relative group rounded-lg bg-gray-900 text-white shadow-md my-4">
            {/* Copy button */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg shadow"
              >
                <Copy size={12} />
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              customStyle={{
                backgroundColor: "transparent",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "0.9em",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className="px-1.5 py-0.5 bg-gray-100 text-pink-500 rounded-md text-sm font-mono">
            {children}
          </code>
        );
      },

      blockquote({ children }: { children?: React.ReactNode }) {
        return (
          <blockquote className="border-l-4 border-indigo-400 pl-4 my-4 italic text-gray-600 bg-indigo-50 py-2 rounded-r-lg">
            {children}
          </blockquote>
        );
      },

      a({
        href = "",
        children,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
        const isExternal = /^https?:\/\//.test(href);
        const isYouTube =
          href.includes("youtube.com") || href.includes("youtu.be");

        if (isYouTube) {
          return <YouTubeEmbed src={href} />;
        }

        return (
          <a
            href={href}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`text-blue-600 hover:text-blue-800 underline ${isExternal ? "font-semibold" : ""
              }`}
            {...props}
          >
            {children}
          </a>
        );
      },

      p({ children }: { children?: React.ReactNode }) {
        // If the only child is an iframe/YouTube, just return that
        if (React.isValidElement(children)) {
          const childType = (children as React.ReactElement).type;
          if (childType === "iframe" || childType === YouTubeEmbed) {
            return children;
          }
        }
        return (
          <p className="mb-4 leading-relaxed text-[16px] font-ubuntu">
            {children}
          </p>
        );
      },

      ul({ children }: { children?: React.ReactNode }) {
        return (
          <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
        );
      },

      ol({ children }: { children?: React.ReactNode }) {
        return (
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {children}
          </ol>
        );
      },

      li({ children }: { children?: React.ReactNode }) {
        return <li className="ml-4">{children}</li>;
      },

      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
      ),

      iframe({ node }: { node?: any }) {
        const src = node?.properties?.src;
        if (src) {
          return <YouTubeEmbed src={src} />;
        }
        return null;
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast]);

  // Render each message in the conversation
  const renderMessage = (message: Message) => {
    const MessageAvatar =
      message.role === "AI" ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full shadow-sm text-white flex items-center justify-center">
          <img src={logo} alt="" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
          <User size={20} />
        </div>
      );

    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${message.role === "USER" ? "flex-row-reverse" : "flex-row"
          }`}
      >
        {MessageAvatar}
        <div
          className={`flex-1 max-w-[70%] p-4 rounded-2xl shadow-md ${message.role === "USER"
              ? "bg-white ml-auto "
              : "bg-white border border-gray-100"
            }`}
        >
          {message.role === "USER" ? (
            <p className=" whitespace-pre-wrap leading-relaxed text-[16px] font-ubuntu">{message.message}</p>
          ) : (
            <ReactMarkdown
              className="text-sm prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2"
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {message.message}
            </ReactMarkdown>
          )}
        </div>
      </div>
    );
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full max-w-[1800px]">
      {/* MAIN CHAT COLUMN */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "w-[70%]" : "w-full"
          }`}
      >
        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#F5F5F5] minimal-scrollbar"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading conversation...</p>
            </div>
          ) : (
            <>
              {messages.map((chat) => (
                <div key={chat.id}>{renderMessage(chat)}</div>
              ))}

              {/* "Thinking..." loader for streaming responses */}
              {isStreaming && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 shadow-sm rounded-full text-white flex items-center justify-center">
                    <img src={logo} alt="AI" />
                  </div>
                  <div className="max-w-[70%] p-4 rounded-2xl shadow-md bg-white border border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-[#F5F5F5]">
          <div className="max-w-4xl mx-auto flex items-center gap-3 border-2 bg-white rounded-xl">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading
                  ? "Loading..."
                  : isStreaming
                    ? "Waiting for response..."
                    : "Ask your mentor..."
              }
              className="flex-1 p-3 border-none rounded-lg focus:outline-none text-sm bg-white"
              disabled={isLoading || isStreaming}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isStreaming || !inputMessage.trim()}
              className={`p-3 rounded-xl shadow-md transition-all text-white ${isLoading || isStreaming || !inputMessage.trim()
                  ? "bg-[#062549] cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR (FUNDAMENTALS) */}
      {fundamentals.length > 0 && (
        <FundamentalBar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          skill={skill}
          fundamentals={fundamentals}
        />
      )}
    </div>
  );
};

export default MentorContainer;
