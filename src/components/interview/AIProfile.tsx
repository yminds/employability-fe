import React from "react";
import waitingGif from "@/assets/interview/waiting.gif";
import speakingGif from "@/assets/interview/speaking.gif";
import listeningGif from "@/assets/interview/listening.gif";
import logoIconWithGradient from "@/assets/branding/logo_icon_with_gradient.svg?url";

interface AIProfileProps {
  interviewState: "WAITING" | "LISTENING" | "SPEAKING";
  frequency: number; // Frequency data, but may no longer be necessary
  height?: string;
}

const AIProfile: React.FC<AIProfileProps> = ({ interviewState, frequency, height = "25vh" }) => {
  // Select the appropriate GIF based on the interview state
  const getGif = () => {
    switch (interviewState) {
      case "WAITING":
        return waitingGif;
      case "LISTENING":
        return listeningGif;
      case "SPEAKING":
        return speakingGif;
      default:
        return waitingGif;
    }
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center overflow-hidden border border-[#0000001A] rounded-lg bg-white p-4"
      style={{ height }}
    >
      <img src={logoIconWithGradient} className="w-20 mt-2" alt="Logo" />

      {/* AI Status GIF */}
      <img src={getGif()} className="w-[250px] h-[120px] object-contain" alt="AI Status" />

    </div>
  );
};

export default AIProfile;
