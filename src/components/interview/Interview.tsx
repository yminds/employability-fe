import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

// Components
import Header from "@/components/interview/Header";
import WebCam from "@/components/interview/WebCam";
import Controls from "@/components/interview/Controls";
import AIProfile from "@/components/interview/AIProfile";
import Conversation from "@/components/interview/Conversation";
import CodeSnippetEditor from "@/components/interview/CodeSnippetEditor";

// Hooks and API
import { useInterviewStreamMutation } from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";
import { useTTS } from "@/hooks/useTTS";
import { useSTT } from "@/hooks/useSTT";

// Constants and Types
const SOCKET_URL = "http://localhost:3000";

export interface IMessage {
  id: number;
  message: string;
  role: "USER" | "AI";
}

const Interview: React.FC<{
  id: string;
  cameraScale: number;
}> = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const [interviewStream] = useInterviewStreamMutation();

  // Queries and Speech Hooks
  const { startRecording, stopRecording, isSttSuccess, sttResponse, sttError } = useSTT();
  const { data: interviewDetails, isSuccess: isInterviewLoaded } = useGetInterviewbyIdQuery(
    interviewId as string, 
    { skip: !interviewId }
  );

  // State
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [codeSnippet, setCodeSnippet] = useState(false);
  const [question, setQuestion] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isComponentMounted = useRef(true);

  // TTS Setup
  const { frequencyData, handleIncomingData } = useTTS({
    onPlaybackComplete: () => {
      setIsUserAnswering(true);
      startRecording();
    },
  });

  // Socket Connection
  useEffect(() => {
    if (!isInterviewLoaded || !interviewDetails?.data?._id) return;

    const newSocket = io(SOCKET_URL);

    const handleConnect = () => {
      console.log("Connected with ID:", newSocket.id);
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

    const handleCodeEditor = (data: string) => {
      setCodeSnippet(true);
      setQuestion(data);
    };

    // Socket event listeners
    newSocket.on("connect", handleConnect);
    newSocket.on(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
    newSocket.on(`codeEditor${interviewDetails.data._id}`, handleCodeEditor);

    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect", handleConnect);
      newSocket.off(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
      newSocket.off(`codeEditor${interviewDetails.data._id}`, handleCodeEditor);
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
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, message: `${lastMessage.message} ${message}` }
          ];
        }
      }
      
      return [...prevMessages, {
        id: prevMessages.length + 1,
        message,
        role
      }];
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
      _id: interviewDetails.data._id,
      thread_id: interviewDetails.data.thread_id,
      user_id: interviewDetails.data.user_id,
    });
  };

  return (
    <div className="w-full h-screen pt-12">
      <div className="flex flex-col max-w-[80%] mx-auto gap-y-12">
        <Header />
        <div className="w-full flex gap-8 max-h-screen">
          <div className="w-[60%] flex flex-col gap-8">
            <WebCam />
            {isUserAnswering ? (
              <Controls doneAnswering={handleDoneAnswering} />
            ) : (
              <div className="text-center text-gray-500" />
            )}
            {codeSnippet && (
              <CodeSnippetEditor
                question={question}
                onSubmission={(code) => {
                  console.log("Code Submitted:", code);
                }}
              />
            )}
          </div>
          <div className="w-[40%] flex flex-col gap-8">
            <AIProfile frequency={frequencyData} />
            <Conversation messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
