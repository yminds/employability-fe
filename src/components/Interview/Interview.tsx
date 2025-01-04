import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

import Header from "@/components/Interview/Header";
import WebCam from "@/components/Interview/WebCam";
import Controls from "@/components/Interview/Controls";
import AIProfile from "@/components/Interview/AIProfile";
import Conversation from "@/components/Interview/Conversation";
import { useInterviewStreamMutation } from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";
import CodeSnippetEditor from "./CodeSnippetEditor";
import { useTTS } from "@/hooks/useTTS";

import { useSTT } from "@/hooks/useSTT";

export interface IMessage {
  id: number;
  message: string;
  role: string;
}

const SOCKET_URL = "http://localhost:3000";

const Interview: React.FC<{
  cameraScale: number;
  id: string;
}> = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const [interviewStream] = useInterviewStreamMutation();

  const { startRecording, stopRecording, isSttSuccess, sttResponse, sttError } =
    useSTT();

  const { data: interviewDetails, isSuccess: isInterviewLoaded } =
    useGetInterviewbyIdQuery(interviewId as string, {
      skip: !interviewId,
    });

  // State Variables
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const isComponentMounted = useRef<boolean>(true);
  const [codeSnippet, setCodeSnippet] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize TTS hook
  const { frequencyData, handleIncomingData } = useTTS({
    onPlaybackComplete: () => {
      setIsUserAnswering(true);
      startRecording();
    },
  });

  // Initialize Socket Connection
  useEffect(() => {
    if (!isInterviewLoaded || !interviewDetails?.data?._id) return;

    const newSocket = io(SOCKET_URL);
    console.log("Connecting to socket server...", newSocket, socket);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
      if (!isInitialized) {
        console.log("Starting initial conversation...");
        setIsInitialized(true);
        addMessage("Hello");
        handleMessage("Hello", "USER");
      }
    });

    newSocket.on(`aiResponse${interviewDetails.data._id}`, (data: string) => {
      handleIncomingData(data, (sentence) => handleMessage(sentence, "AI"));
    });

    newSocket.on(`codeEditor${interviewDetails.data._id}`, (data: string) => {
      setCodeSnippet(true);
      setQuestion(data);
    });

    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect");
      newSocket.off("aiResponse");
      newSocket.disconnect();
    };
  }, [isInterviewLoaded, interviewDetails]);

  useEffect(() => {
    if (isSttSuccess && sttResponse) {
      handleMessage(sttResponse.transcription.text, "USER");
      addMessage(sttResponse.transcription.text);
    }

    if (sttError) {
      console.error("Error transcribing audio:", sttError);
    }
  }, [isSttSuccess, sttResponse, sttError]);

  // Handle User Done Answering
  const handleDoneAnswering = () => {
    if (isUserAnswering) {
      stopRecording();
      setIsUserAnswering(false);
    }
  };

  // Add Message to State with Appending Logic for AI
  const handleMessage = (message: string, role: string = "USER") => {
    if (role === "AI") {
      setMessages((prevMessages) => {
        if (prevMessages.length === 0) {
          return [
            {
              id: 1,
              message: message,
              role: role,
            },
          ];
        }

        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage.role === "AI") {
          const updatedLastMessage: IMessage = {
            ...lastMessage,
            message: `${lastMessage.message} ${message}`,
          };

          return [
            ...prevMessages.slice(0, prevMessages.length - 1),
            updatedLastMessage,
          ];
        } else {
          return [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              message: message,
              role: role,
            },
          ];
        }
      });
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message: message,
          role: role,
        },
      ]);
    }
  };

  // Function to Initiate AI Message Stream
  const addMessage = (prompt: string) => {
    if (!interviewDetails?.data?._id) {
      console.error("Interview details not loaded yet");
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
              <div className="text-center text-gray-500"></div>
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
