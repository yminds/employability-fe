import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

// Components
import Header from "@/components/interview/Header";
import WebCam from "@/components/interview/WebCam";
import Controls from "@/components/interview/Controls";
import AIProfile from "@/components/interview/AIProfile";
import Conversation from "@/components/interview/Conversation";

// Hooks and API
import { useInterviewStreamMutation } from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";
import { useTTS } from "@/hooks/useTTS";
import { useSTT } from "@/hooks/useSTT";
import CodeSnippetQuestion from "./CodeSnippetQuestion";
import { useGetUserFundamentalsBySkillIdMutation } from "@/api/fundementalSlice";

// Constants and Types
const SOCKET_URL = "http://localhost:3000";

interface CodeSnippetType {
  code: string;
  question: string;
}

export interface IMessage {
  id: number;
  message: string;
  role: "USER" | "AI";
}

interface QuestionState {
  question: string;
  codeSnippet: CodeSnippetType | null;
  isCodeSnippetMode: boolean;
  concept: string;
}

const Interview: React.FC<{
  id: string;
  cameraScale: number;
  interviewTopic: string;
  concepts: any[];
}> = ({ interviewTopic, concepts }) => {
  const { id: interviewId } = useParams<{ id: string }>();
  const [interviewStream] = useInterviewStreamMutation();

  // Queries and Speech Hooks
  const { startRecording, stopRecording, isSttSuccess, sttResponse, sttError } = useSTT();
  const { data: interviewDetails, isSuccess: isInterviewLoaded } = useGetInterviewbyIdQuery(interviewId as string, {
    skip: !interviewId,
  });

  // State
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [question, setQuestion] = useState<QuestionState>({
    question: "",
    codeSnippet: null,
    isCodeSnippetMode: false,
    concept: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [layoutType, setLayoutType] = useState<1 | 2>(1);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);

  const isComponentMounted = useRef(true);

  // TTS Setup
  const { frequencyData, handleIncomingData } = useTTS({
    onPlaybackComplete: () => {
      setTimeout(() => {
        setIsUserAnswering(true);
        startRecording();
      }, 50);
    },
  });

  // Socket Connection
  useEffect(() => {
    if (!isInterviewLoaded || !interviewDetails?.data?._id) return;

    const newSocket = io(SOCKET_URL);

    const handleConnect = () => {
      if (!isInitialized) {
        setIsInitialized(true);
        const initialGreeting = "Hello";
        addMessage(initialGreeting);
        handleMessage(initialGreeting, "USER");
      }
    };

    const handleAIResponse = (data: string) => {
      handleIncomingData(data, (sentence) => handleMessage(sentence, "AI"));
    };

    const handleShiftLayout = (data: string) => {
      setLayoutType(data === "1" ? 1 : 2);
      setQuestion((prev) => ({
        ...prev,
        isCodeSnippetMode: false,
      }));
    };

    const handleGenerateQuestion = (question: string, concept: string) => {
      console.log(question);
      setQuestion({
        question,
        codeSnippet: null,
        isCodeSnippetMode: false,
        concept,
      });
    };

    const handleGenerateCodeSnippet = (codeSnippetData: CodeSnippetType, concept: string) => {
      console.log("Generate Code Snippet", codeSnippetData, concept);
      setQuestion((prev) => ({
        ...prev,
        codeSnippet: codeSnippetData,
        isCodeSnippetMode: true,
        concept,
      }));
    };

    const handleEndInterview = () => {
      setIsInterviewEnded(true);
    };

    // Socket event listeners
    newSocket.on("connect", handleConnect);
    newSocket.on(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
    newSocket.on(`shiftLayout${interviewDetails.data._id}`, handleShiftLayout);
    newSocket.on(`generateQuestion${interviewDetails.data._id}`, handleGenerateQuestion);
    newSocket.on(`generateCodeSnippet${interviewDetails.data._id}`, handleGenerateCodeSnippet);
    newSocket.on(`endInterview${interviewDetails.data._id}`, handleEndInterview);

    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect", handleConnect);
      newSocket.off(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
      newSocket.off(`shiftLayout${interviewDetails.data._id}`, handleShiftLayout);
      newSocket.off(`generateQuestion${interviewDetails.data._id}`, handleGenerateQuestion);
      newSocket.off(`generateCodeSnippet${interviewDetails.data._id}`, handleGenerateCodeSnippet);
      newSocket.disconnect();
    };
  }, [isInterviewLoaded, interviewDetails]);

  // Speech-to-Text handling
  useEffect(() => {
    if (isSttSuccess && sttResponse) {
      const { text } = sttResponse.transcription;
      handleMessage(text, "USER");
      addMessage(text);
    }

    if (sttError) {
      console.error("Speech-to-text error:", sttError);
    }
  }, [isSttSuccess, sttResponse, sttError]);

  const handleDoneAnswering = () => {
    if (isUserAnswering) {
      stopRecording();
      setIsUserAnswering(false);
    }
  };

  const handleMessage = (message: string, role: "USER" | "AI") => {
    setMessages((prevMessages) => {
      if (role === "AI") {
        if (prevMessages.length === 0) {
          return [{ id: 1, message, role }];
        }

        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "AI") {
          return [...prevMessages.slice(0, -1), { ...lastMessage, message: `${lastMessage.message} ${message}` }];
        }
      }

      return [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message,
          role,
        },
      ];
    });
  };

  const addMessage = (prompt: string) => {
    if (!interviewDetails?.data?._id) {
      console.error("Interview details not available");
      return;
    }

    interviewStream({
      prompt,
      model: "gpt-4o",
      provider: "openai",
      // model: "claude-3-5-sonnet-latest",
      // provider: "anthropic",
      // model: "gemini-2.0-flash-exp",
      // model: "gemini-1.5-flash-latest",
      // provider: "google",
      // model: "deepseek-chat",
      // provider: "deepseek",

      _id: interviewDetails.data._id,
      thread_id: interviewDetails.data.thread_id,
      user_id: interviewDetails.data.user_id,
      user_skill_id: interviewDetails.data.user_skill_id,
      skill_id: interviewDetails.data.skill_id,
      code_snippet: question.codeSnippet?.code || "",
      question: question.question,
      skill_name: interviewTopic,
      concepts: concepts.slice(0,2),
      interview_id: interviewDetails.data._id,
    });
  };

  return (
    <div className="w-full h-screen pt-12">
      <div className="flex flex-col max-w-[80%] mx-auto gap-y-12">
        <Header />
        {isInterviewEnded ? (
          <div className="text-center text-gray-500">
            <p>Thank you for your time. We will get back to you soon.</p>
          </div>
        ) : (
          <LayoutBuilder
            isUserAnswering={isUserAnswering}
            handleDoneAnswering={handleDoneAnswering}
            question={question}
            frequencyData={frequencyData}
            messages={messages}
            layoutType={2}
          />
        )}~
      </div>
    </div>
  );
};

interface LayoutBuilderProps {
  isUserAnswering: boolean;
  handleDoneAnswering: () => void;
  question: QuestionState;
  frequencyData: any;
  messages: IMessage[];
  layoutType: 1 | 2;
}

const LayoutBuilder = ({
  isUserAnswering,
  handleDoneAnswering,
  question,
  frequencyData,
  messages,
  layoutType,
}: LayoutBuilderProps) => {
  return layoutType === 1 ? (
    <div className="w-full flex gap-8 max-h-screen">

  

      <div className="w-[60%] flex flex-col gap-8">
        <WebCam />
        {isUserAnswering ? (
          <Controls doneAnswering={handleDoneAnswering} />
        ) : (
          <div className="text-center text-gray-500" />
        )}
      </div>
      <div className="w-[40%] flex flex-col gap-8">
        <AIProfile frequency={frequencyData} />
        <Conversation layoutType={1} messages={messages} />
      </div>
    </div>
  ) : (
    <div className="w-full flex gap-8 max-h-screen">     
      <div className="w-[45%] flex flex-col gap-8">
        <AIProfile height={"20vh"} frequency={frequencyData} />
        {question.isCodeSnippetMode && question.codeSnippet ? (
          <CodeSnippetQuestion question={question.codeSnippet.question} codeSnippet={question.codeSnippet.code} />
        ) : (
          <Conversation layoutType={2} messages={messages} />
        )}
      </div>
      <div className="w-[55%] flex flex-col gap-8">
        <WebCam />
        {isUserAnswering ? (
          <Controls doneAnswering={handleDoneAnswering} />
        ) : (
          <div className="text-center text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default Interview;
