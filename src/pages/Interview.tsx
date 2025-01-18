import React from "react";
// import useInterviewSetup from "@/hooks/useInterviewSetup";
import Interview from "@/components/interview/Interview.tsx";
import { useParams } from "react-router-dom";
import CheckSetup from "../components/setup/CheckSetup";

const InterviewSetupNew: React.FC = () => {
  const { id } = useParams();

  // const {
  //   isInterviewStarted,
  //   setIsInterviewStarted,
  //   isScreenSharing,
  //   handleShareScreen,
  //   stopScreenSharing,
  //   screenStream,
  //   videoRef,
  //   handleMicQualityChange,
  //   handleCameraChange,
  //   handleScaleChange,
  //   cameraScale,
  //   isProceedButtonEnabled,
  // } = useInterviewSetup();

  return (
    <>
      {/* {!isInterviewStarted ? ( */}
      { false ? (
        // <div className="flex items-center h-screen w-[70%] mx-auto sm:w-[95%]">
        //   <main className="py-4 w-full">
        //     <div className="flex flex-row items-center justify-between mb-6">
        //       <div className="">
        //         <div className="text-black text-[32px] font-bold font-ubuntu">
        //           Check Your Setup
        //         </div>
        //         <p className="text-base font-normal text-[#00000099] ">
        //           Before you proceed to the interview, make sure your setup is
        //           working properly.
        //         </p>
        //       </div>
        //       <button
        //         className={`bg-[#10B754] ${
        //           isProceedButtonEnabled
        //             ? "hover:bg-green-600"
        //             : "cursor-not-allowed opacity-50"
        //         } text-white rounded-[4px] font-semibold text-[16px] w-72 py-2 `}
        //         onClick={() => setIsInterviewStarted(true)}
        //         disabled={!isProceedButtonEnabled}
        //       >
        //         Proceed to Interview
        //       </button>
        //     </div>
        //     <CheckSetup
        //       isScreenSharing={isScreenSharing}
        //       screenStream={screenStream}
        //       handleShareScreen={handleShareScreen}
        //       stopScreenSharing={stopScreenSharing}
        //       handleMicQualityChange={handleMicQualityChange}
        //       handleCameraChange={handleCameraChange}
        //       handleScaleChange={handleScaleChange}
        //       videoRef={videoRef}
        //     />
        //   </main>
        // </div>
        <></>
      ) : (
        <Interview cameraScale={100} id={id as string} />
        // <Interview cameraScale={cameraScale} id={id as string} />
      )}
    </>
  );
};

export default InterviewSetupNew;
