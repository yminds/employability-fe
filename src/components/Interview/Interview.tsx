import { useEffect, useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

import Header from "@/components/interview/Header";
import WebCam from "@/components/interview/WebCam";
import Controls from "@/components/interview/Controls";
import AIProfile from "@/components/interview/AIProfile";
import Conversation from "@/components/interview/Conversation";
import {
  useStreamMutation,
  useSttMutation,
  useTtsMutation,
} from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";

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
  // API Mutations
  const [stream] = useStreamMutation();
  const [tts] = useTtsMutation();
  const [stt, { isSuccess: isSttSuccess, data: sttResponse, error: sttError }] =
    useSttMutation();

  const { data: interviewDetails } = useGetInterviewbyIdQuery(
    interviewId as string
  );

  useEffect(() => {

  }, [interviewDetails]);

  // State Variables
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const bufferRef = useRef<string>(""); // Buffer to accumulate incoming data
  const isComponentMounted = useRef<boolean>(true); // To handle component unmounting

  // Sentence indexing for ordered playback
  const sentenceIndexRef = useRef<number>(0); // Assigns a unique index to each sentence
  const nextSentenceToPlayRef = useRef<number>(0); // Tracks the next sentence to play
  const audioBufferMap = useRef<Map<number, Blob>>(new Map()); // Buffers audio blobs indexed by sentence
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  const recordingProcessed = useRef(false);
  const frequencyDataRef = useRef<number>(0);

  const timerStartRef = useRef<Date | null>(null);

  // Initialize Socket Connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      // Optional configurations
    });
    console.log("Connecting to socket server...", newSocket, socket);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
    });

    newSocket.on(`output${currentMessageIndex}`, (data: string) => {
      handleIncomingData(data, currentMessageIndex);
      if (timerStartRef.current) {
        // const endTime = new Date();
        // console.log("Timer ended at:", endTime);

        // const durationMs = endTime.getTime() - timerStartRef.current.getTime();
        // console.log(`Duration: ${durationMs} ms`);

        // Additional console log for elapsed time
        // console.log(`Elapsed Time: ${durationMs / 1000} seconds`);

        timerStartRef.current = null; // Reset the timer
      }
    });

    // Cleanup on unmount
    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect");
      newSocket.off(`output${currentMessageIndex}`);
      newSocket.disconnect();
    };
  }, [currentMessageIndex]); // Added currentMessageIndex to dependencies if needed

  // Handle incoming data by accumulating and parsing sentences
  const handleIncomingData = (data: string, currentMessageIndex: number) => {
    bufferRef.current += data;

    // Regex to match complete sentences
    const sentenceRegex = /[^.!?]+[.!?]/g;
    const sentences = bufferRef.current.match(sentenceRegex) || [];

    // Process each complete sentence
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence) {
        // Append sentence to the AI message
        handleMessage(trimmedSentence, "AI");

        // Handle TTS and playback
        const currentIndex = sentenceIndexRef.current;
        sentenceIndexRef.current += 1;

        // Add to messages as AI response
        // Send TTS request immediately
        tts({ text: trimmedSentence })
          .unwrap()
          .then((audioBlob) => {
            audioBufferMap.current.set(currentIndex, audioBlob);
            attemptPlayback();
          })
          .catch((error) => {
            console.error("Error fetching TTS audio:", error);
          });
        // fetchTTS(trimmedSentence, currentIndex);
      }
    });

    // Remove processed sentences from the buffer
    bufferRef.current = bufferRef.current.replace(sentenceRegex, "");
  };

  // Function to attempt playback of the next sentence
  const attemptPlayback = () => {
    const currentPlayIndex = nextSentenceToPlayRef.current;
    const audioBlob = audioBufferMap.current.get(currentPlayIndex);

    if (audioBlob) {
      // Remove the blob from the map to free memory
      audioBufferMap.current.delete(currentPlayIndex);

      // Play the audio
      playAudio(audioBlob)
        .then(() => {
          // Increment to the next sentence index
          nextSentenceToPlayRef.current += 1;
          // Recursively attempt to play the next sentence
          attemptPlayback();
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          // Even if there's an error, proceed to the next sentence
          nextSentenceToPlayRef.current += 1;
          attemptPlayback();
        });
    }
  };

  // Function to play audio and handle frequency analysis
  const playAudio = async (audioBlob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.crossOrigin = "anonymous"; // Enable CORS if needed

      // Set up Web Audio API for frequency analysis
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const calculateFrequency = () => {
        analyser.getByteFrequencyData(dataArray);
        // Calculate the average frequency
        const avgFrequency =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        // Normalize the frequency to a range of 0 to 1
        const normalizedFrequency = avgFrequency / 255;

        // Update frequency data ref
        frequencyDataRef.current = normalizedFrequency;

        // Update the state to trigger UI update only if there's a change
        if (frequencyData !== normalizedFrequency) {
          setFrequencyData(normalizedFrequency);
        }
      };

      // Use timeupdate event to call calculateFrequency
      audioElement.addEventListener("timeupdate", calculateFrequency);

      audioElement.play();

      audioElement.onended = () => {
        // Clean up timeupdate listener
        audioElement.removeEventListener("timeupdate", calculateFrequency);

        if (nextSentenceToPlayRef.current + 1 === sentenceIndexRef.current) {
          setIsUserAnswering(true); // Now safe to set this flag as it's the last segment
          startRecording();
        }

        // Reset frequency data when speech ends
        frequencyDataRef.current = 0;
        setFrequencyData(0);
        resolve();
      };

      audioElement.onerror = (error) => {
        console.error("Audio playback error:", error);
        // Clean up timeupdate listener in case of error as well
        audioElement.removeEventListener("timeupdate", calculateFrequency);
        reject(error);
      };

      // Cleanup function for when the component unmounts or playback is stopped
      return () => {
        audioElement.removeEventListener("timeupdate", calculateFrequency);
        audioElement.pause(); // Stop the audio
        audioElement.src = ""; // Release the resource
        if (audioContext) {
          audioContext.close(); // Close the audio context when not needed
        }
      };
    });
  };

  // Media Recorder Setup
  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder(
    {
      audio: true,
      mediaRecorderOptions: { mimeType: "audio/webm" },
      onStop: async (blobUrl) => {
        // Prevent multiple calls to onStop
        if (recordingProcessed.current) return;
        recordingProcessed.current = true;

        try {
          const response = await fetch(blobUrl);
          const audioBlob = await response.blob();

          const formData = new FormData();
          formData.append("audio", audioBlob);

          stt(audioBlob); // Uncomment and implement STT as needed
          clearBlobUrl();
        } catch (error) {
          console.error("Error transcribing audio:", error);
        } finally {
          // Reset the flag after processing
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
    // Only stop recording if user is answering
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
          // If no messages exist, add the AI message
          return [
            ...prevMessages,
            {
              id: 1,
              message: message,
              role: role,
            },
          ];
        }

        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage.role === "AI") {
          // Append to the latest AI message
          const updatedLastMessage: IMessage = {
            ...lastMessage,
            message: `${lastMessage.message} ${message}`,
          };

          // Replace the last message with the updated message
          return [
            ...prevMessages.slice(0, prevMessages.length - 1),
            updatedLastMessage,
          ];
        } else {
          // Add a new AI message
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
      // Handle USER messages normally
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
    // Add AI Greeting
    addMessage("Hello");
    // Add User Greeting
    handleMessage("Hello", "USER");
  }, []);

  // Function to Initiate AI Message Stream
  const addMessage = (prompt: string) => {
    stream({
      prompt: `
      previous conversation:
      ${messages.map((msg) => msg.message).join("\n")}
      ${prompt}`,
      system:
        "YOU ARE REACT INTERVIEWER WHO DOESN'T EXPLAIN ANY CONCEPTS JUST TAKE THE INTERVIEW AND ASK QUESTIONS WITHOUT GIVING HINTS, its a real mock conversation interview so ask a question and wait for user response and then ask another question",
      // model: "gpt-4o",
      // provider: "openai",
      messageId: currentMessageIndex,
      model: "claude-3-5-haiku-20241022",
      provider: "anthropic",
      // "model": "claude-3-5-haiku-20241022",
      // "provider":"anthropic"
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
