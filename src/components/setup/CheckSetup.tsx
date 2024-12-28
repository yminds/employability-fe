import React from "react";
import MicCheck from "@/components/setup/MicCheck";
import CameraCheck from "@/components/setup/CameraCheck";
import ScreenSharing from "@/components/setup/ScreenSharing";

type CheckSetupPageProps = {
  isScreenSharing: boolean;
  screenStream: MediaStream | null;
  handleShareScreen: () => Promise<void>;
  stopScreenSharing: () => void;
  handleMicQualityChange: (isSelected: boolean, isMicTested: boolean) => void;
  handleCameraChange: (isCameraSelected: boolean) => void;
  handleScaleChange: (scale: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const CheckSetupPage: React.FC<CheckSetupPageProps> = ({
  isScreenSharing,
  screenStream,
  handleShareScreen,
  stopScreenSharing,
  handleMicQualityChange,
  handleCameraChange,
  handleScaleChange,
  videoRef,
}) => {
  return (
    <div className="flex flex-row h-[75vh] w-full gap-4 sm:flex-col">
      <div className="flex flex-col w-2/5 h-full gap-4 sm:w-full">
        <MicCheck onMicQualityChange={handleMicQualityChange} />
        <ScreenSharing
          isScreenSharing={isScreenSharing}
          screenStream={screenStream}
          stopScreenSharing={stopScreenSharing}
          handleShareScreen={handleShareScreen}
          videoRef={videoRef}
        />
      </div>
      <div className="w-3/5 h-full sm:w-full">
        <CameraCheck
          onScaleChange={handleScaleChange}
          onCameraChange={handleCameraChange}
        />
      </div>
    </div>
  );
};

export default CheckSetupPage;
