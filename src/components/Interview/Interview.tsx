// Interview.tsx
import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import WebCam from "./WebCam";
import Controls from "./Controls";
import AIProfile from "./AIProfile";
import Conversation from "./Conversation";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import { io, Socket } from "socket.io-client";

export interface IMessage {
  id: number;
  message: string;
  sender: string;
}

const SOCKET_URL = "http://localhost:3000";

const Interview: React.FC<{
  cameraScale: number;
  id: string;
}> = () => {
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

  const recordingProcessed = useRef(false);

  const timerStartRef = useRef<Date | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      // Optional configurations
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
    });

    newSocket.on("output", (data: string) => {
      // Stop the timer and print the end time,
      handleIncomingData(data);

      if (timerStartRef.current) {
        const endTime = new Date();
        console.log("Timer ended at:", endTime);

        const durationMs = endTime.getTime() - timerStartRef.current.getTime();
        console.log(`Duration: ${durationMs} ms`);

        // Additional console log for elapsed time
        console.log(`Elapsed Time: ${durationMs / 1000} seconds`);

        timerStartRef.current = null; // Reset the timer
      }
    });

    // Cleanup on unmount
    return () => {
      isComponentMounted.current = false;
      newSocket.off("connect");
      newSocket.off("output");
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once

  // Handle incoming data by accumulating and parsing sentences
  const handleIncomingData = (data: string) => {
    bufferRef.current += data;

    // Regex to match complete sentences
    const sentenceRegex = /[^.!?]+[.!?]/g;
    const sentences = bufferRef.current.match(sentenceRegex) || [];

    // Process each complete sentence
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence) {
        // Assign a unique index to the sentence
        const currentIndex = sentenceIndexRef.current;
        sentenceIndexRef.current += 1;

        // Add to messages as AI response
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            message: trimmedSentence,
            sender: "AI Interviewer",
          },
        ]);

        // Send TTS request immediately
        fetchTTS(trimmedSentence, currentIndex);
      }
    });

    // Remove processed sentences from the buffer
    bufferRef.current = bufferRef.current.replace(sentenceRegex, "");
  };

  // Function to fetch TTS audio and handle ordered playback
  const fetchTTS = async (text: string, index: number) => {
    try {
      const response = await fetch(
        "http://localhost:3000/utility/text2Speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate speech");
      }

      const audioBlob = await response.blob();

      // Store the audio blob in the buffer map
      audioBufferMap.current.set(index, audioBlob);

      // Attempt to play audio if it's the next in sequence
      attemptPlayback();
    } catch (error) {
      console.error("Error fetching TTS audio:", error);
    }
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
        setFrequencyData(normalizedFrequency);
        if (!audioElement.paused && isComponentMounted.current) {
          requestAnimationFrame(calculateFrequency);
        }
      };

      calculateFrequency();

      audioElement.play();

      audioElement.onended = () => {
        setIsUserAnswering(true);
        startRecording();
        setFrequencyData(0); // Reset frequency data when speech ends
        resolve();
      };

      audioElement.onerror = (error) => {
        console.error("Audio playback error:", error);
        reject(error);
      };
    });
  };

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

          const res = await fetch("http://localhost:3000/utility/speech2Text", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to transcribe audio");
          }

          const data = await res.json();
          sendMessage(data.transcription.text);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              message: data.transcription.text,
              sender: "User",
            },
          ]);
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

  useEffect(() => {
    const startTimer = setTimeout(() => {
      sendMessage(`Tell me a long story about rabbit
        `);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message: "Hello",
          sender: "User",
        },
      ]);
    }, 1000);
    return () => clearTimeout(startTimer);
  }, []);

  const handleDoneAnswering = () => {
    // Only stop recording if user is answering
    if (isUserAnswering) {
      stopRecording();
      setIsUserAnswering(false);
    }
  };
  const sendMessage = async (message: string) => {
    timerStartRef.current = new Date();
    console.log("Timer started at:", timerStartRef.current);

    // reset the time , Start Timer and print the start time
    try {
      const response = await axios.post(
        `http://localhost:3000/openai/threads/thread_pKIPJfBDu9sOWTbObajQOfi3/messages-and-run`,
        {
          content: message,
          assistantId: "asst_gggeZ8qgQLERTicPfw8CnO0F",
          instructions: "",
        }
      );

      // Assuming the response contains a field 'content' which is a list of responses
      const aiResponse = response.data.content[0].text.value;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message: aiResponse,
          sender: "AI Interviewer",
        },
      ]);

      // Enqueue the AI response for TTS and playback
      const currentIndex = sentenceIndexRef.current;
      sentenceIndexRef.current += 1;
      fetchTTS(aiResponse, currentIndex);
    } catch (error) {
      console.error("Error sending message to AI:", error);
    }
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
