import React from "react";
import CustomDropdown from "./ui/dropdown";
import { useMicrophoneCheck } from "../hooks/useMicrophoneCheck";

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
    <div className={`bg-[#FAFAFA] flex flex-col gap-4 p-4 rounded-xl h-[280px] ${isMicSelected && qualityTested ? "border-[#10B754] border-2" : "border border-[#DBDBDB]"}`}>
      <div className="flex justify-between items-center">
        <div className="text-[#333] text-xl font-medium flex items-center gap-5">
          <span className="flex w-10 h-10 p-3 justify-center items-center bg-white border border-[#ddd] rounded-full">
            <img className="w-6 h-4" src="./src/assets/images/screen-setup/mic.svg" alt="Mic" />
          </span>
          <span>Mic Check</span>
        </div>
        {isMicSelected && qualityTested && (
          <div className="flex items-center gap-2 relative">
            <input type="checkbox" checked readOnly className="w-6 h-6 appearance-none" />
            <img className="h-6 w-6 absolute" src="./src/assets/images/screen-setup/check_circle.svg" alt="Check" />
          </div>
        )}
      </div>

      <CustomDropdown
        options={microphones.map((mic) => ({ label: mic.label || `Mic ${mic.deviceId}`, value: mic.deviceId }))}
        value={selectedMic || ""}
        placeholder="Select Microphone"
        onChange={handleMicChange}
        width={390}
        dropdownWidth={300}
      />

      <div className="flex flex-col h-[125px] rounded-[6px] items-start gap-4 p-2.5 bg-white border border-[#E6E6E6] ">
        <div className="text-[#666] text-sm">Level Input</div>
        <div className="flex gap-3">
          {dots.map((isActive, i) => (
            <span key={i} className={`w-3 h-6 rounded-full ${isSpeaking && isActive ? "bg-[#10B754]" : "bg-gray-200"}`} />
          ))}
        </div>

        <button
          className={` h-6 w-14 rounded text-[12px] ${qualityTested ? "bg-gray-500" : "bg-[#10B754]"} text-white`}
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
