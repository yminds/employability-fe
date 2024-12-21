import React from 'react';
import useInterviewSetup from 'src/hooks/useInterviewSetup';
import CheckSetupPage from './CheckSetup';
import Interview from 'src/components/Interview/Interview';

const InterviewSetupNew: React.FC = () => {
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
      {!isInterviewStarted ?
        <div className=' flex items-center justify-center h-screen'>
          <main className="max-w-7xl mx-auto w-[1084px] py-5">
            <div className="flex items-end justify-between w-full">
              <div className="text-black text-[32px] font-bold font-ubuntu">Check Your Setup</div>
              <button
                className={`bg-[#10B754] ${
                  isProceedButtonEnabled ? 'hover:bg-green-600' : 'cursor-not-allowed opacity-50'
                } text-white rounded-[4px] font-semibold text-[16px] w-72 py-2 mt-6`}
                onClick={() => setIsInterviewStarted(true)}
                disabled={!isProceedButtonEnabled}
              >
                Proceed to Interview
              </button>
            </div>
            <p className="text-base font-normal pb-7 text-[#00000099] w-[680px]">
              We use audio, video, and screen sharing to generate an accurate assessment & proctoring score.
              Please note that the recording of your screen will be included in the AI interview report.
            </p>
            
            <CheckSetupPage
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
       :<Interview/> }
      
    </>
  );
};

export default InterviewSetupNew;