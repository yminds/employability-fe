import React from "react";
import useInterviewSetup from "@/hooks/useInterviewSetup";
import Interview from "@/components/interview/Interview";
import { useParams } from "react-router-dom";
import CheckSetup from "../components/setup/CheckSetup";

const InterviewSetupNew: React.FC = () => {
  const { id } = useParams();

  const {
    isInterviewStarted,
    setIsInterviewStarted,
    isScreenSharing,
    handleShareScreen,
    stopScreenSharing,
    screenStream,
    videoRef,
    handleMicQualityChange,
    handleCameraChange,
    handleScaleChange,
    cameraScale,
    isProceedButtonEnabled,
  } = useInterviewSetup();

  return (
    <>
      {!isInterviewStarted ? (
        <div className=" flex items-center justify-center h-screen">
          <main className="max-w-7xl mx-auto w-[1084px] py-5">
            <div className="flex flex-row items-center mb-10">
              <div className="w-full">
                <div className="text-black text-[32px] font-bold font-ubuntu">
                  Check Your Setup
                </div>
                <p className="text-base font-normal text-[#00000099] w-[680px]">
                  Before you proceed to the interview, make sure your setup is
                  working properly.
                </p>
              </div>
              <div className="flex items-end justify-between ">
                <button
                  className={`bg-[#10B754] ${
                    isProceedButtonEnabled
                      ? "hover:bg-green-600"
                      : "cursor-not-allowed opacity-50"
                  } text-white rounded-[4px] font-semibold text-[16px] w-72 py-2 `}
                  onClick={() => setIsInterviewStarted(true)}
                  disabled={!isProceedButtonEnabled}
                >
                  Proceed to Interview
                </button>
              </div>
            </div>

            <CheckSetup
              isScreenSharing={isScreenSharing}
              screenStream={screenStream}
              handleShareScreen={handleShareScreen}
              stopScreenSharing={stopScreenSharing}
              handleMicQualityChange={handleMicQualityChange}
              handleCameraChange={handleCameraChange}
              handleScaleChange={handleScaleChange}
              videoRef={videoRef}
            />
          </main>
        </div>
      ) : (
        <Interview cameraScale={cameraScale} id={id as string} />
      )}
    </>
  );
};

export default InterviewSetupNew;
