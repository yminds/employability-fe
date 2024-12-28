import React from "react";
import Dropdown from "@/components/ui/custom-dropdown";
import { useMicrophoneCheck } from "@/hooks/useMicrophoneCheck";

// Images
import check_circle from '@/assets/screen-setup/check_circle.svg'
import mic from '@/assets/screen-setup/mic.svg'

interface MicCheckProps {
  onMicQualityChange: (isMicSelected: boolean, isMicTested: boolean) => void;
}

const MicCheck: React.FC<MicCheckProps> = ({ onMicQualityChange }) => {
  const {
    microphones,
    selectedMic,
    dots,
    isMicSelected,
    isSpeaking,
    qualityTested,
    handleMicChange,
    handleSpeakClick,
  } = useMicrophoneCheck(onMicQualityChange);
  

  return (
    <div className={`bg-[#FAFAFA] flex flex-col gap-1 justify-around p-3 rounded-xl h-[35vh] ${isMicSelected && qualityTested ? "border-[#10B754] border-2" : "border border-[#DBDBDB]"}`}>
      <div className="flex justify-between items-center">
        <div className="text-[#333] text-xl font-medium flex items-center gap-5">
          <span className="flex sm:w-[1vw]h-[2vh] md:w-12 h-12 p-3 justify-center items-center bg-white border border-[#ddd] rounded-full">
            <img className="sm:w-[1vw] sm:h-[3vh] md:w-6h-5" src={mic} alt="Mic" />
          </span>
          <span>Mic Check</span>
        </div>
        {isMicSelected && qualityTested && (
          <div className="flex items-center gap-2 relative">
            <input type="checkbox" checked readOnly className="w-6 h-6 appearance-none" />
            <img className="h-6 w-6 absolute" src={check_circle} alt="Check" />
          </div>
        )}
      </div>

      <Dropdown
        options={microphones.map((mic) => ({ label: mic.label || `Mic ${mic.deviceId}`, value: mic.deviceId }))}
        value={selectedMic || ""}
        placeholder="Select Microphone"
        onChange={handleMicChange}
        width={30}
        dropdownWidth={30}
      />

      <div className="flex flex-col h-[15vh] rounded-[6px] items-start justify-between p-2.5 bg-white border border-[#E6E6E6] ">
        <div className="text-[#666] text-sm">Level Input</div>
        <div className="flex w-[100%] justify-between">
          {dots.map((isActive, i) => (
            <span key={i} className={`w-[0.7vw] h-[4vh] rounded-[.5rem] ${isSpeaking && isActive ? "bg-[#10B754]" : "bg-gray-200"}`} />
          ))}
        </div>

        <button
          className={` h-[3vh] w-[10vw] rounded text-[12px]  ${qualityTested ? "bg-gray-500" : "bg-[#10B754]"} text-white`}
          onClick={handleSpeakClick}
          disabled={!isMicSelected}
        >
          {qualityTested ? "Tested" : isMicSelected && isSpeaking ? "Testing..." : "Speak"}
        </button>
      </div>
    </div>
  );
};

export default MicCheck;