import React, { RefObject, useEffect, useState } from "react";

// Images
import check_circle from "@/assets/screen-setup/check_circle.svg";
import screenshare from "@/assets/screen-setup/screenShare.svg";
import SkillVerificationTutorial from "../skills/SkillVerificationTutorial";
import InterviewGuide from "../interview/InterviewGuide";
import unCheck_circle from "@/assets/screen-setup/unCheck_circle.png";
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
        <InterviewGuide
          onClose={handleCloseTutorial}
          onConfirm={handleConfirmTutorial}
          dontShowAgain={dontShowAgain}
          setDontShowAgain={setDontShowAgain}
          component={"ScreenSharing"}
        />
      )}
      <div
        className={`bg-[#FAFAFA] p-[24px] pe-5 flex flex-col justify-around  gap-1 rounded-xl h-[40vh] ${
          isScreenSharing ? " border-[#10B754] border-2" : "border border-[#DBDBDB]"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-[#333] text-[18px] not-italic font-medium leading-[normal] flex items-center gap-5">
            <span className="flex sm:w-[3vw] md:w-12 w-12 h-12 p-3 justify-center items-center bg-white border border-[#ddd] rounded-full">
              <img className="sm:w-[1vw] sm:h-[3vh] md:w-6 h-5 " src={screenshare} alt="screenShare" />
            </span>
            Screen Sharing
          </div>

          {/* Display checkbox only if screen sharing is active */}
          
        {isScreenSharing? (
          <div className="flex  gap-1 relative p-1 pr-3 border border-green-500 rounded-2xl items-center bg-[#DBFFEA]">
              <input type="checkbox" checked readOnly className="w-6 h-6 appearance-none" />
              <img className="h-6 w-6 absolute" src={check_circle} alt="UnCheck" />
              <p className="font-ubuntu text-green-600 text-sm">Checked</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 relative">
            <input type="checkbox" checked readOnly className="w-6 h-6 appearance-none" />
            <img className="h-6 w-8 absolute" src={unCheck_circle} alt="UnCheck" />
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
            <button
              className={`text-green-600 text-center text-[14px] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-green-600 w-[10vw] }`}
              onClick={handleShareScreenClick}
            >
              Share Screen
            </button>
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
