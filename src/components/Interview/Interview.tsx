// Interview.tsx
import React, { useEffect, useState } from "react";
import Header from "./Header";
import WebCam from "./WebCam";
import Controls from "./Controls";
import AIProfile from "./AIProfile";
import Conversation from "./Conversation";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

export interface IMessage {
  id: number;
  message: string;
  sender: string;
}

const Interview: React.FC = () => {
  const [isUserAnswering, setIsUserAnswering] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder(
    {
      audio: true,
      mediaRecorderOptions: { mimeType: "audio/webm" },
      onStop: async (blobUrl) => {
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
        }
      },
    }
  );

  useEffect(() => {
    const startTimer = setTimeout(() => {
      sendMessage("Hello");
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

  const speak = async (text: string) => {
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
        requestAnimationFrame(calculateFrequency);
      };

      calculateFrequency();

      audioElement.play();
      audioElement.onended = () => {
        setIsUserAnswering(true);
        startRecording();
        setFrequencyData(0); // Reset frequency data when speech ends
      };
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDoneAnswering = () => {
    setIsUserAnswering(false);
    stopRecording();
  };

  const sendMessage = async (message: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/openai/threads/thread_pKIPJfBDu9sOWTbObajQOfi3/messages-and-run`,
        {
          content: message,
          assistantId: "asst_gggeZ8qgQLERTicPfw8CnO0F",
          instructions: "",
        }
      );
      speak(response.data.content[0].text.value);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message: response.data.content[0].text.value,
          sender: "AI Interviewer",
        },
      ]);
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
