import React from "react";
import waitingGif from "@/assets/interview/Waitinggif.gif";
import speakingGif from "@/assets/interview/AISpeaking.gif";
import listeningGif from "@/assets/interview/listening.gif";
import stillStateGif from "@/assets/interview/StillState.gif";
import logoIconWithGradient from "@/assets/branding/logo_icon_with_gradient.svg?url";

interface AIProfileProps {
  interviewState: "WAITING" | "LISTENING" | "SPEAKING" | "AI_RETRYING";
  frequency: number; // Frequency data, but may no longer be necessary
  height?: string;
  isAiRetrying: boolean;
}

const AIProfile: React.FC<AIProfileProps> = ({ interviewState, frequency, height = "25vh", isAiRetrying }) => {
  // Select the appropriate GIF based on the interview state
  const getGif = () => {
    switch (interviewState) {
      case "WAITING":
        return waitingGif;
      case "LISTENING":
        return listeningGif;
      case "SPEAKING":
        return speakingGif;
      case "AI_RETRYING":
        return isAiRetrying ? stillStateGif : waitingGif;
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
      {isAiRetrying ? (
        <>
          <img src={stillStateGif} className="w-[250px] h-[120px] object-contain" alt="AI Status" />
          <p className="font-dm-sans">AI is retrying...</p>
        </>
      ) : (
        <>
          <img src={getGif()} className="w-[250px] h-[120px] object-contain" alt="AI Status" />
          <p className="font-dm-sans">{interviewState?.toLocaleLowerCase()}...</p>
        </>
      )}
    </div>
  );
};

export default AIProfile;
