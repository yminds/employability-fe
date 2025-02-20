import React, { RefObject, useEffect, useState } from "react";

// Images
import check_circle from '@/assets/screen-setup/check_circle.svg'
import screenshare from '@/assets/screen-setup/screenShare.svg'
import MultiScreenDetector from "../interview/multiScreendetector";
import SkillVerificationTutorial from "../skills/SkillVerificationTutorial";

interface ScreenSharingComponentProps {
  isScreenSharing: boolean;
  screenStream: MediaStream | null;
  stopScreenSharing: () => void;
  handleShareScreen: () => void;
  videoRef: RefObject<HTMLVideoElement>; // Prop to pass the videoRef
}

const ScreenSharingComponent: React.FC<ScreenSharingComponentProps> = ({
  isScreenSharing,
  screenStream,
  stopScreenSharing,
  handleShareScreen,
  videoRef,
}) => {
  const [screenCount, setScreenCount] = useState<number>(1);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  useEffect(() => {
    // Check if tutorial has already been seen
    const hasSeenTutorial = localStorage.getItem("hasSeenScreenShareTutorial") === "true";
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }
  }, []);
  
  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const handleConfirmTutorial = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenScreenShareTutorial", "true");
    }
    setShowTutorial(false);
    handleShareScreen(); // Proceed to share screen after tutorial
  };

  const handleShareScreenClick = () => {
    const hasSeenTutorial = localStorage.getItem("hasSeenScreenShareTutorial") === "true";

    if (hasSeenTutorial) {
      handleShareScreen();
    } else {
      setShowTutorial(true);
    }
  };

  return (
    <>
      {/* Skill Verification Tutorial Popup */}
      {showTutorial && (
        <SkillVerificationTutorial
          onClose={handleCloseTutorial}
          onConfirm={handleConfirmTutorial}
          dontShowAgain={dontShowAgain}
          setDontShowAgain={setDontShowAgain}
          component={"ScreenSharing"}
        />
      )}
      <div
        className={`bg-[#FAFAFA] p-[24px] pe-8 flex flex-col justify-around  gap-1 rounded-xl h-[40vh] ${isScreenSharing
            ? " border-[#10B754] border-2"
            : "border border-[#DBDBDB]"
          }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-[#333] text-xl not-italic font-medium leading-[normal] flex items-center gap-5">
            <span className="flex sm:w-[3vw]h-[6vh] md:w-12 h-12 p-3 justify-center items-center bg-white border border-[#ddd] rounded-full">
              <img
                className="sm:w-[2vw]h-[4vh] md:w-6h-6"
                src={screenshare}
                alt="screenShare"
              />
            </span>
            Screen Sharing
          </div>

          {/* Display checkbox only if screen sharing is active */}
          {isScreenSharing && (
            <div className="flex items-center gap-2 relative">
              <input
                type="checkbox"
                checked
                readOnly
                id="screenShare-check"
                className="w-6 h-6 appearance-none"
              />
              <img
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm"
                src={check_circle}
                alt=""
              />
            </div>
          )}
        </div>

        {/* Button to start or stop screen sharing */}
        {isScreenSharing ? (
          <button
            className="text-red-500 text-center text-[0.86rem] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-red-500 w-[10VW]"
            onClick={stopScreenSharing}
          >
            Stop Sharing
          </button>
        ) : (
          <div className="flex justify-between items-center">
            {screenCount != 1 && (
              <MultiScreenDetector onScreenCountChange={setScreenCount} />
            )}
            {screenCount === 1 && (
              <button
                className={`text-[#10B754] text-center text-[0.86rem] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-[#10B754] w-[10vw] ${screenCount > 1 ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={handleShareScreenClick}
                disabled={screenCount > 1}
              >
                Share Screen
              </button>
            )
            }
          </div>
        )}

        {/* Video container */}
        <div className="w-full h-[17vh] bg-[#E8FAF1] flex p-1 justify-center items-center  rounded-md">
          {isScreenSharing && screenStream && (
            <video
              ref={videoRef} // Using the videoRef prop
              className="w-full h-full object-contain"
              autoPlay
              playsInline
              muted
            />
          )}
        </div>
      </div>
    </>

  );
};

export default ScreenSharingComponent;