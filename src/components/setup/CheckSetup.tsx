import React from 'react';
import MicCheck from '@/components/setup/MicCheck';
import CameraCheck from '@/components/setup/CameraCheck';
import ScreenSharing from '@/components/setup/ScreenSharing';

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
    <div>
      {/* Components Grid */}
      <div className="grid grid-cols-5 grid-flow-col gap-4 h-[610px]">
        <div className="col-span-2 h-[280px]">
          <MicCheck onMicQualityChange={handleMicQualityChange} />
        </div>
        <div className="row-span-1 col-span-2 h-[310px]">
          <ScreenSharing
            isScreenSharing={isScreenSharing}
            screenStream={screenStream}
            stopScreenSharing={stopScreenSharing}
            handleShareScreen={handleShareScreen}
            videoRef={videoRef}
          />
        </div>
        <div className="row-span-3 col-span-3 h-[610px]">
          <CameraCheck
            onScaleChange={handleScaleChange}
            onCameraChange={handleCameraChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckSetupPage;
