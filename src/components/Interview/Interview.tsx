import { useEffect, useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

import Header from "@/components/interview/Header";
import WebCam from "@/components/interview/WebCam";
import Controls from "@/components/interview/Controls";
import AIProfile from "@/components/interview/AIProfile";
import Conversation from "@/components/interview/Conversation";
import { useStreamMutation, useSttMutation } from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";
import CodeSnippetEditor from "./CodeSnippetEditor";
import { useTTS } from "@/hooks/useTTS"; // Import the new hook

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
  const [stream] = useStreamMutation();
  const [stt, { isSuccess: isSttSuccess, data: sttResponse, error: sttError }] =
    useSttMutation();

  const { data: interviewDetails } = useGetInterviewbyIdQuery(
    interviewId as string
  );

  useEffect(() => {}, [interviewDetails]);

  // State Variables
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const isComponentMounted = useRef<boolean>(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [codeSnippet, setCodeSnippet] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const recordingProcessed = useRef(false);
  const timerStartRef = useRef<Date | null>(null);

  // Initialize TTS hook
  const { frequencyData, handleIncomingData } = useTTS({
    onPlaybackComplete: () => {
      setIsUserAnswering(true);
      startRecording();
    },
  });

  // Initialize Socket Connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    console.log("Connecting to socket server...", newSocket, socket);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
    });

    newSocket.on(`output${currentMessageIndex}`, (data: string) => {
      handleIncomingData(data, (sentence) => handleMessage(sentence, "AI"));
      if (timerStartRef.current) {
        timerStartRef.current = null;
      }
    });

    newSocket.on(`codeEditor`, (data: string) => {
      setCodeSnippet(true);
      setQuestion(data);
    });

    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect");
      newSocket.off(`output${currentMessageIndex}`);
      newSocket.disconnect();
    };
  }, [currentMessageIndex]);

  // Media Recorder Setup
  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder(
    {
      audio: true,
      mediaRecorderOptions: { mimeType: "audio/webm" },
      onStop: async (blobUrl) => {
        if (recordingProcessed.current) return;
        recordingProcessed.current = true;

        try {
          const response = await fetch(blobUrl);
          const audioBlob = await response.blob();

          const formData = new FormData();
          formData.append("audio", audioBlob);

          stt(audioBlob);
          clearBlobUrl();
        } catch (error) {
          console.error("Error transcribing audio:", error);
        } finally {
          recordingProcessed.current = false;
        }
      },
    }
  );

  // Handle STT Success and Errors
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

  // Initial Setup: Add Greeting Messages
  useEffect(() => {
    addMessage("Hello");
    handleMessage("Hello", "USER");
  }, []);

  // Function to Initiate AI Message Stream
  const addMessage = (prompt: string) => {
    stream({
      prompt: `
      previous conversation:
      ${messages.map((msg) => msg.message).join("\n")}
      ${prompt}`,
      system: `YOU ARE REACT INTERVIEWER WHO DOESN'T EXPLAIN ANY CONCEPTS JUST TAKE THE INTERVIEW AND ASK QUESTIONS WITHOUT GIVING HINTS, its a real mock conversation interview so ask a question and wait for user response and then ask another question
       use miniCodeEditor tool to ask code snippet question whenever needed not for every question
        `,
      // model: "gpt-4o",
      // provider: "openai",
      model: "claude-3-5-sonnet-latest",
      provider: "anthropic",
      messageId: currentMessageIndex,
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
