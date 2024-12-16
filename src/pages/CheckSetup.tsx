import React from "react";
import { useNavigate } from "react-router-dom";
import CameraCheck from "@/components/setup/CameraCheck";
import MicCheck from "@/components/setup/MicCheck";
import ScreenSharing from "@/components/setup/ScreenSharing";

const CheckSetup: React.FC = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  return (
    <div className="flex flex-col font-sans items-center justify-center h-screen">
      <div className="w-[960px] justify-start">
        <h1 className="text-[#1A1A1A] text-[32px] font-semibold leading-[51.2px] tracking-[-0.7px]">
          Check Your Setup
        </h1>
        <p className="text-gray-500 mb-8">
          We use audio, video, and screen sharing to generate an accurate
          assessment & proctoring score. Please note that the recording of
          <br />
          your screen will be included in the AI interview report.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 w-[960px] h-[450px] gap-8">
        <CameraCheck />
        <MicCheck />
        <ScreenSharing />
      </div>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mt-8 shadow-md"
        onClick={() => navigate("/interview")} // Navigate to /interview route
      >
        Proceed to Interview
      </button>
    </div>
  );
};

export default CheckSetup;
