import React, { useState, useEffect, useRef } from "react";
import { useSendMentorMessageMutation } from "@/api/mentorChatApiSlice";
import { useGetMessagesQuery } from "@/api/mentorUtils";
import { io } from "socket.io-client";
import logo from "@/assets/mentor/mentor_img.png";
import send from "@/assets/mentor/send.svg";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "./MarkdownAndVideo";
import VideosAtEnd from "./YoutubeVideosGrid";
import { YouTubeProvider } from "./YouTubeContext";
import QuizActionBtns from "./QuizActionBtns";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "wss://employability.ai";

interface MentorChatThreadsProps {
  chatId: string | null;
  userId: string | undefined;
  fundamentals: any[];
  skill: string;
  isLoading: boolean; // parent's initial loading
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  finalQuizScore: { score: number, correctAnswers: any, wrongAnswers: any };
  currentPendingTopic: string;
  onStartQuiz: (topic: string) => void;
  skipCurrentConcept: () => void;
}

interface Message {
  id: number;
  message: string;
  role: "USER" | "AI";
}

const MentorChatThreads: React.FC<MentorChatThreadsProps> = ({
  chatId,
  userId,
  fundamentals,
  skill,
  isLoading,
  setIsLoading,
  finalQuizScore,
  currentPendingTopic,
  onStartQuiz,
  skipCurrentConcept
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // 1) Create a ref for the chat container & input:
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const userImg = useSelector((state: RootState) => state.auth.user?.profile_image);

  // 2) Query for existing messages
  const { data: threadMessagesData } = useGetMessagesQuery(
    { threadId: chatId || "", userId: userId },
    { skip: !chatId }
  );

  // Convert server messages to local shape
  useEffect(() => {
    if (threadMessagesData?.data) {
      const serverMessages = threadMessagesData.data;
      const loadedMessages: Message[] = serverMessages.map(
        (msg: any, index: number) => ({
          id: index,
          message: msg.message,
          role: msg.role === "USER" ? "USER" : "AI",
        })
      );
      setMessages(loadedMessages);
      setIsLoading(false);

      // Ensure we scroll to bottom when messages first load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [threadMessagesData, setIsLoading]);

  // If final quiz score > 0, automatically send an update to the chat
  useEffect(() => {
    if (finalQuizScore.score > 0) {
      const formattedCorrectAnswers = finalQuizScore.correctAnswers
        .map((item: { question: any; correctAnswer: any; }) => `Question: "${item.question}" – Answer: "${item.correctAnswer}"`)
        .join("; ");

      const formattedWrongAnswers = finalQuizScore.wrongAnswers
        .map((item: { question: any; selectedOption: any; correctAnswer: any; }) => `Question: "${item.question}" – Your Answer: "${item.selectedOption}", Correct: "${item.correctAnswer}"`)
        .join("; ");

      handleSendMessage(
        true,
        `Hey I have cleared a Quiz on the concept ${currentPendingTopic} and have scored ${finalQuizScore.score} marks in it. My correct answers are ${formattedCorrectAnswers}, and my wrong answers were ${formattedWrongAnswers}. Could you analyze my performance, highlight any strengths and weaknesses, and provide suggestions for improvement? Based on my score, should I move on to further concepts or revisit this topic for more practice?`
      );
    }
  }, [finalQuizScore]);

  // 3) Socket.io for streaming updates
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on(`mentorResponse${userId}`, (textPart: string) => {
      setIsStreaming(false);
      setIsLoading(false);
      updateAIMessage(textPart);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, setIsLoading]);

  // If not streaming, focus on the input
  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  const updateAIMessage = (text: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === "AI") {
        // Append text to the last AI message
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, message: lastMessage.message + text },
        ];
      }
      // Otherwise, create a new AI message
      return [
        ...prev,
        { id: prev.length + 1, message: text, role: "AI" },
      ];
    });
  };

  // 4) Send user message
  const [sendMentorMessage] = useSendMentorMessageMutation();

  const handleSendMessage = async (
    isFinalScore: boolean = false,
    userMessage: string = ""
  ) => {
    const message = isFinalScore && userMessage !== "" ? userMessage : inputMessage.trim();
    if (!message || !chatId || !userId || isStreaming) return;

    try {
      // Add user message to local state
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, message, role: "USER" },
      ]);
      setInputMessage("");
      setIsStreaming(true);

      // Ensure we scroll to bottom when user sends a message
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Reset textarea height
      adjustTextareaHeight();

      await sendMentorMessage({
        prompt: message,
        chatId,
        userId,
        fundamentals,
        skill,
      }).unwrap();
    } catch (err) {
      console.error("Error sending message:", err);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          message: "Sorry, there was an error. Please try again.",
          role: "AI",
        },
      ]);
    }
  };

  // 5) Press Enter to send
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 6) Scroll handling
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const bottomThreshold = 100; // pixels from bottom

      // Check if we're near the bottom
      const atBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
      setIsNearBottom(atBottom);

      // Show scroll button when not at bottom
      setShowScrollButton(!atBottom);
    }
  };

  // 7) Auto-scroll when new messages arrive if already at bottom
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  // 8) Set up scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Function to automatically adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      // Reset height to auto first to correctly calculate the new height
      textarea.style.height = 'auto';

      // Calculate the new height based on the scrollHeight, clamped at 200px maximum
      const newHeight = Math.min(textarea.scrollHeight, 200);

      // Set the new height
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Call adjustTextareaHeight whenever inputMessage changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  // 9) Render each message
  const renderMessage = (msg: Message) => {
    const isAI = msg.role === "AI";
    const lastAiMessageId = messages.filter((m) => m.role === "AI").slice(-1)[0]?.id;

    const showQuizButtons =
      isAI && messages.length >= 4 && msg.id === lastAiMessageId;

    return (
      <div
        key={msg.id}
        className={`flex items-start gap-3 w-fit ${msg.role === "USER" ? "flex-row-reverse ml-auto" : "flex-row"
          }`}
      >
        {/* Avatar */}
        {isAI && (
          <div className="flex-shrink-0 w-8 h-8 rounded mt-4 flex items-center justify-center">
            <img src={logo} alt="AI" />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`flex-1 p-3 max-w-[60vw] rounded-2xl ${isAI
            ? "bg-[#F5F5F5] border border-gray-100"
            : "bg-white w-fit"
            }`}
        >
          {isAI ? (
            <>
              <YouTubeProvider>
                <ReactMarkdown
                  children={msg.message}
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                />
                {/* All videos shown at the end */}
                <VideosAtEnd />
                {/* Conditionally show quiz buttons */}
                {showQuizButtons && (
                  <QuizActionBtns
                    fundamentals={fundamentals}
                    currentQuizTopic={currentPendingTopic}
                    onStartQuiz={onStartQuiz}
                    skipCurrentConcept={skipCurrentConcept}
                    showSkipBtn={false}
                  />
                )}
              </YouTubeProvider>
            </>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-[16px] font-ubuntu w-fit">
              {msg.message}
            </p>
          )}
        </div>
      </div>
    );
  };

  // 10) The actual UI
  return (
    <div className="flex flex-col flex-1 h-[70vh] w-full items-center minimal-scrollbar overflow-y-auto">
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-grow  space-y-6 xl:max-h-[66vh] 2xl:max-h-[70vh] minimal-scrollbar w-[780px]"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}

            {/* Streaming "Thinking..." Indicator */}
            {isStreaming && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full shadow-sm flex items-center justify-center">
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

      {/* Scroll to bottom button */}
      {/* {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 bg-button text-white p-3 rounded-full border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC] transition-all transform hover:-translate-y-1 z-10 flex items-center justify-center"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={12} />
        </button>
      )} */}

      {/* Input Box */}
      <div className="bg-white absolute bottom-0 w-[780px] rounded-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 border-2 min-h-[64px] rounded-xl">
          <div className="flex justify-between items-end w-full px-3 min-h-[64px]">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                // Auto-resize logic
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading
                  ? "Loading..."
                  : isStreaming
                    ? "Waiting for response..."
                    : "Chat with your mentor AI..."
              }
              className="flex-1 flex justify-center border-none rounded-lg focus:outline-none text-body2 max-h-[200px] min-h-[20px] max-w-[94%] resize-none overflow-y-auto whitespace-pre-wrap mt-3"
              disabled={isLoading || isStreaming}
              
            />
            <button
              onClick={() => handleSendMessage(false, "")}
              disabled={isLoading || isStreaming || !inputMessage.trim()}
              className={`rounded-xl transition-all text-white ${isLoading || isStreaming || !inputMessage.trim() ? "cursor-not-allowed" : ""
                }`}
            >
              <img className="bg-[#F0F5F3] py-1 px-2 rounded-lg h-[42px] w-[42px] mb-3" src={send} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatThreads;